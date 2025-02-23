import { Pool, PoolClient } from "pg";

declare var self: Worker;

const client: Pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "postgres",
  password: "postgress",
  port: 5432,
  max: 30,
  idleTimeoutMillis: 10000,
});

const Fifo = {
  data: [],
  size: 0,
};

await client.connect();

self.onmessage = async (event: MessageEvent) => {
  console.log("Received item to queue");

  try {
    await client.query("BEGIN");
    const query = `
        INSERT INTO books_ts (key, title, cover_id, subject, authors)
        VALUES ($1, $2, $3, $4, $5);
      `;

    const values = [
      book.key || "n/a",
      book.title,
      book.cover_id,
      JSON.stringify(book.subject),
      JSON.stringify(book.authors),
    ];

    await client.query(query, values);
    await client.query("COMMIT");
  } catch (error) {
    console.log(`Error inserting book with key ${book.key}:`, error);
    await client.query("ROLLBACK");
  }
};
