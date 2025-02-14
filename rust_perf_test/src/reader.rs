use anyhow::Result;
use futures_util::StreamExt;

use std::str::FromStr;
use std::sync::Arc  ;

use tokio::sync::RwLock;
use tokio::io::{AsyncRead, AsyncWrite};
use tokio_tungstenite::WebSocketStream;
use tokio_tungstenite::tungstenite::protocol::Message;
use tokio::sync::mpsc::{Receiver , Sender};

use tokio::sync::Mutex;
use crate::book::Book;


pub async fn process_book(mut  receiver : Receiver<String> , dest : Arc<Mutex<Vec<Book>>> ) -> Result<()>{
    while let Some(msg) = receiver.recv().await{
        let mut lock = dest.lock().await;
        lock.push(
            serde_json::from_str(
                msg.as_str()
            ).expect("Couldnt parse Json")
        );
    }
    Ok(())
}


async fn publish(rx : Sender<String>,  data : &str)->Result<()>{
    rx.send(String::from_str(data)?).await?;
    Ok(())
}

    

pub async fn read_buffer<S>(  receiver_socket : Arc<RwLock<WebSocketStream<S>>>,  book_list : Sender<String>) -> Result<()>

    where S:AsyncRead + AsyncWrite + Unpin + Send + 'static,
{
    let mut socket = receiver_socket.write().await;
    while let Some(status) =socket.next().await{
        match status.expect("Client error"){
            Message::Text(text) =>{
                publish(book_list.clone(), text.as_str()).await.unwrap();
            }
            Message::Close(_text)=> {
                log::warn!("Ending connection " );
            }
            _ => {
                log::info!("Lets end it please");
            }
        }
    }
    Ok(())
}
