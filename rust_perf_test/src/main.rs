use std::ops::Deref;
use std::sync::Arc;
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
        .max_connections(1000)
        .connect("sqlite:../rust_db.sqlite")
        .await?;
    simple_logger::init_with_level(Level::Info).unwrap();
    // create_table(&database).await?;

    let parser = JsonParser::new().await?;
    log::debug!("{:?}", parser.book_list[0].authors);

    log::info!("Starting to Write Books to DB ");
    let arc_db = Arc::new(database);
    let start_time = Instant::now();
    let libray = Arc::new(parser.book_list);

    for _i in 0..1000 {
        let clone_db = arc_db.clone();
        let clone_json = libray.clone();
        let unwrap = tokio::spawn(async move {
            let _ = tokio::task::spawn(async move {
                for book in clone_json.iter() {
                    insert_books(&clone_db, &book)
                        .await
                        .expect("Could not write to db");
                }
            })
            .await;
        });
        unwrap.await?;
    }

    log::info!("Finished at {:?}", start_time.elapsed());
    log::info!("Finished Writing to DB");

    Ok(())
}

async fn insert_books(db: &SqlitePool, json_data: &Book) -> Result<()> {
    let authors_list = serde_json::to_string(&json_data.authors)?;
    let _result = sqlx::query(
        r#"
                        INSERT INTO rust_db_migrate
                        (key, title, cover_id, subject, authors) values ( ?1, ?2, ?3, ?4, ?5);
                        "#,
    )
    .bind(json_data.key.clone())
    .bind(json_data.title.clone())
    .bind(json_data.cover_id.clone())
    .bind(json_data.cover_id.to_string())
    .bind(authors_list)
    .execute(db)
    .await?;

    Ok(())
}
