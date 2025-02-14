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

import Fetcher from "./libs/server";
import write_to_db from "./libs/write";
import { read_all_db, read_file } from "./libs/read";
//connect to DB
import { Pool, PoolClient } from "pg";

const connect_to_client = async () => {
  const client: Pool = new Pool({
    user: "postgres",
    host: "127.0.0.1",
    database: "postgres",
    password: "postgress",
    port: 5432,
    max: 30,
    idleTimeoutMillis: 10000,
  });
  return client;
};
const create_table = async (client: Pool) => {
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS books_ts(
      id SERIAL PRIMARY KEY,
      key varchar NOT NULL,
      title varchar NOT NULL,
      cover_id INTEGER NOT NULL,
      subject varchar NOT NULL,
      authors varchar NOT NULL 
      );`);
  } catch (error) {
    console.log(error);
  }
};

const get_count = (client: Pool) => {
  const query = client.query("SELECT COUNT(id) FROM books_ts");
  return query;
};

const client: Pool = await connect_to_client();
await create_table(client);
const content: any[] = await read_file();

const main = async (client: Pool) => {
  let keepWriting = true;

  setTimeout(() => {
    console.log("End");
    keepWriting = false;
    // process.exit(0);
  }, 120000);

  let i = 0;
  const interval = setInterval(async () => {
    if (keepWriting) {
      for (let i = 0; i < content.length; i++) {
        await write_to_db(client, content[i]);
      }
    } else {
      clearInterval(interval); // Stop the interval when keepWriting is false
      console.log("End");
      await client.end();
    }
  }, 0); // This will run approximately every 10ms. Adjust as needed.
};
/*
 * ---------------------------------------MAIN----------------------------------------------------------------
 */

await main(client);

//    /***************** DOCS ************** */
//creating table
//erase comment for new json
// const Teo = new Fetcher();
// await Teo.map_data();
// await Teo.write_to_file();
