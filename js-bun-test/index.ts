//firstly create a websocket client
//then on message push data received onto queue
//from that queue the message will be written to
//the sql

import { resolve } from "bun";
import Database from "bun:sqlite";
import { Book } from "./types/types";
import { book_insert, create_table } from "./libs/database";

const WS_URL = "ws://localhost:3000";
const client = new WebSocket(WS_URL);
const db: Database = new Database("../Test.db", { strict: true });
create_table(db);

console.log("Started listening at local host 3000");
client.addEventListener("open", (event) => {
  client.send("Hey");
});

var i = false;
client.addEventListener("message", (event) => {
  const data: string = event.data.toString();
  const parsed = JSON.parse(data);
  const book: Book = parsed;
  book_insert(db, book);
});
