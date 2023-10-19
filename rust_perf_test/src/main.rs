use std::sync::Arc;
use std::time::Duration;
use std::time::Instant;

use anyhow::Result;
use libs::Book;
use libs::JsonParser;
use log::Level;
use sqlx::postgres::PgPoolOptions;
use sqlx::Pool;
use sqlx::Postgres;
mod libs;
use dotenv::dotenv;
#[tokio::main(flavor = "multi_thread", worker_threads = 50)]
async fn main() -> Result<()> {
    dotenv().ok();
    let database = PgPoolOptions::new()
        .max_connections(30)
        .idle_timeout(Duration::new(30, 0))
        .connect(std::env::var("DATABASE_URL")?.as_str())
        .await?;
    simple_logger::init_with_level(Level::Info).unwrap();
    // create_table(&database).await?;

    let parser = JsonParser::new().await?;
    log::debug!("{:?}", parser.book_list[0].authors);

    log::info!("Starting to Write Books to DB ");
    let start_time = Instant::now();

    let ref_db = Arc::new(database);
    let ref_parser = Arc::new(parser);

    while start_time.elapsed() < Duration::from_secs(120) {
        let db_conn = ref_db.clone();
        let lib_parser = ref_parser.clone();
        separete_books(&db_conn, &lib_parser).await?;
    }

    let counted = get_count(&ref_db).await?;
    log::info!("Finished at {} records written in 1 minute", counted);

    Ok(())
}

async fn get_count(db: &Pool<Postgres>) -> Result<i64> {
    let result = sqlx::query_as::<_, (i64,)>("SELECT COUNT(id) FROM rust_db_migrate")
        .fetch_one(db)
        .await?;
    Ok(result.0)
}

async fn separete_books(db: &Pool<Postgres>, json_data: &JsonParser) -> Result<()> {
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

async fn insert_books(db: &Pool<Postgres>, json_data: Book) -> Result<()> {
    let mut transaction = db.begin().await?;
    let authors_list = serde_json::to_string(&json_data.authors)?;
    let _result = sqlx::query(
        r#"
                        INSERT INTO rust_db_migrate
                        (key, title, cover_id, subject, authors) values ( $1, $2, $3, $4, $5);
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
