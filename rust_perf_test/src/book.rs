use std::fmt::Display;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Book {
    pub key: Box<str>,
    pub title: Box<str>,
    pub cover_id: i32,
    pub subject: Vec<Box<str>>,
    pub authors: Vec<Authors>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Authors {
    pub key: Box<str>,
    pub name: Box<str>,
}
//pub use read_json::JsonParser;

impl Display for Authors {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}, {})", self.key, self.name)
    }
}
