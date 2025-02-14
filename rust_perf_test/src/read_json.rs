use std::fs;

use super::Book;
use anyhow::Result;

pub struct JsonParser {
    pub book_list: Vec<Book>,
}

impl JsonParser {
    pub async fn new() -> Result<Self> {
        match Self::read_json().await {
            Ok(list) => Ok(Self { book_list: list }),
            Err(_e) => Err(_e),
        }
    }

    pub async fn read_json() -> Result<Vec<Book>> {
        let contents = fs::read_to_string("test.json")?;
        let json: Vec<Book> = serde_json::from_str(&contents)?;
        Ok(json)
    }
}
