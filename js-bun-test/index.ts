/**
 *
 *
 *
 *  @author Mateo Ortega
 *  @purpose
 *  This is a script to compare bun runtime VS rust tokio runtime to complete a certain amount of operations on a db
 *  For the DB I have chosen SQLITE for ease of use to get the point accross.
 *  Two emerging technologies that are emerging.
 *  This is for fun and to see what would perform better!
 *  My pick RUST
 *
 *
 * @secret ADDING C++ to the mix
 */

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

client.addEventListener("message", (event) => {
  const data: string = event.data.toString();
  const parsed = JSON.parse(data);
  const book: Book = parsed;
  book_insert(db, book);
});
