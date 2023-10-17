use std::sync::Arc;
use std::time::Duration;
use std::time::Instant;

use anyhow::Result;
use libs::Book;
use libs::JsonParser;
use log::Level;
use sqlx::sqlite::SqlitePool;
use sqlx::sqlite::SqlitePoolOptions;
mod libs;
#[tokio::main(flavor = "multi_thread", worker_threads = 32)]
async fn main() -> Result<()> {
    let database = SqlitePoolOptions::new()
        .max_connections(15)
        .idle_timeout(Duration::new(3, 0))
        .connect("sqlite:../rust_db.sqlite")
        .await?;
    simple_logger::init_with_level(Level::Info).unwrap();
    // create_table(&database).await?;

    let parser = JsonParser::new().await?;
    log::debug!("{:?}", parser.book_list[0].authors);

    log::info!("Starting to Write Books to DB ");
    let start_time = Instant::now();

    let mut handles = vec![];
    let ref_db = Arc::new(database);
    let ref_parser = Arc::new(parser);

    for _ in 0..1 {
        let db_conn = ref_db.clone();
        let lib_parser = ref_parser.clone();

        let handle = tokio::spawn(async move {
            separete_books(&db_conn, &lib_parser)
                .await
                .expect("Startup error");
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.await.unwrap();
    }
    log::info!("Finished at {:?}", start_time.elapsed());
    log::info!("Finished Writing to DB");
    // clean().await?;
    Ok(())
}

async fn separete_books(db: &SqlitePool, json_data: &JsonParser) -> Result<()> {
    let mut handles = vec![];
    for books in json_data.book_list.clone() {
        let db_cln = db.clone();
        let handle = tokio::spawn(async move {
            insert_books(&db_cln, books).await.expect("Error at db");
        });
        handles.push(handle);
    }
    for handle in handles {
        handle.await?;
    }

    Ok(())
}

async fn insert_books(db: &SqlitePool, json_data: Book) -> Result<()> {
    let mut transaction = db.begin().await?;
    let authors_list = serde_json::to_string(&json_data.authors)?;
    let _result = sqlx::query(
        r#"
                        INSERT INTO rust_db_migrate
                        (key, title, cover_id, subject, authors) values ( ?1, ?2, ?3, ?4, ?5);
                        "#,
    )
    .bind(json_data.key)
    .bind(json_data.title)
    .bind(json_data.cover_id)
    .bind(json_data.cover_id.to_string())
    .bind(authors_list)
    .execute(&mut *transaction)
    .await?;
    transaction.commit().await?;
    Ok(())
}
