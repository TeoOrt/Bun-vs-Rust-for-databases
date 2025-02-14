//firstly create a websocket client
//then on message push data received onto queue
//from that queue the message will be written to
//the sql

import { resolve } from "bun";
import Database from "bun:sqlite";

type Author = {
  key: string | null;
  name: string | null;
};

type Book = {
  key: string;
  title: string;
  cover_id: number;
  subject: string[];
  authors: Author[];
};
//
const WS_URL = "ws://localhost:3000";
const client = new WebSocket(WS_URL);
const db = new Database("../Test.db");
const query = db.query("select 'Hello world' as message;");
const res = query.get();

console.log("Started listening at local host 3000");
client.addEventListener("open", (event) => {
  client.send("Hey");
});

client.addEventListener("message", (event) => {
  const data: string = event.data.toString();
  const book: Book[] = JSON.parse(data);
});
