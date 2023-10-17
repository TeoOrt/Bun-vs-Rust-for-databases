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

import { Database } from "bun:sqlite";
import Fetcher from "./libs/server";
import write_to_db from "./libs/write";
import { read_all_db, read_file } from "./libs/read";
//connect to DB
const db: Database = new Database("../rust_db.sqlite");
//creating table
db.exec(`CREATE TABLE IF NOT EXISTS books_ts(
id INTEGER PRIMARY KEY,
key TEXT NOT NULL,
title TEXT NOT NULL,
cover_id INTEGER NOT NULL,
subject TEXT NOT NULL,
authors TEXT NOT NULL 
);`);

//erase comment for new json
// const Teo = new Fetcher();
// await Teo.map_data();
// await Teo.write_to_file();

/*
 * ACTIONS
 * FIRST TEST
 * READ JSON FILE
 * WRITE TO DB
 */
type Averages = {
  read: number[];
  write: number[];
};
let averages: Averages = { read: [], write: [] };

const time_read_file = new Date().getTime();
const content: any[] = await read_file();
const time_read_file_e = new Date().getSeconds();

const write_time = performance.now();
for (let i = 0; i < 1; i++) {
  write_to_db(db, content);
  // averages.read.push(time_read_file_e - time_read_file);
  // const read_all = new Date().getTime();
}
const write_time_e = performance.now();

console.log("This operation took: ", write_time_e - write_time, "s");

// read_all_db(db, content);
// const read_all_e = new Date().getTime();
// averages.write.push(read_all_e - read_all);

// const read_averages =
//   averages.read.reduce((cur: number, next: number) => (cur += next)) /
//   averages.read.length;

// const write_averages =
//   averages.write.reduce((cur: number, next: number) => (cur += next)) /
//   averages.write.length;

// const results = `
// READ FILE TOOK = ${time_read_file_e - time_read_file},
// WRITE TO DB TOOK = ${write_averages},
// `;

// Bun.write("result_js.txt", results);
// SECOND TEST
// READ DATABASE
