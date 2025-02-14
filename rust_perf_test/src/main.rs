use anyhow::Result;
mod book;
mod profilers;
mod reader;
use reader::{process_book, read_buffer};
use log::Level;

use tokio_tungstenite::connect_async ;
use tokio_tungstenite::tungstenite::protocol::Message;
use std::sync::Arc;
use futures_util::SinkExt;
use url::Url;
use tokio::sync::{Mutex,RwLock,mpsc};


#[tokio::main]
async fn main() -> Result<()> {
    simple_logger::init_with_level(Level::Info).unwrap();
    log::info!("Starting to Write Books to DB ");

    let url = Url::parse("ws://127.0.0.1:3000").expect("Parsed incorrectly url");
    let (mut ws_stream,_) = connect_async(url.as_str()).await.expect("Failed to connect to WS Server");

    ws_stream.send(Message::Text("Hello Server".into())).await?;
    let streamer = Arc::new(RwLock::new(ws_stream));
    let receiver_socket = Arc::clone(&streamer);
    let closing_socket = Arc::clone(&streamer);

    let (tx, rx)= mpsc::channel(100);

    let book_storage = Vec::new();

    let book_ptr = Arc::new(Mutex::new(book_storage));

    let task1 = tokio::spawn(read_buffer(receiver_socket, tx));
    let task2 = tokio::spawn(process_book(rx,book_ptr));

    let (_, _)= tokio::join!(
    task1,
    task2
    );
    

    closing_socket.write().await.close(None).await?;

    Ok(())
}

