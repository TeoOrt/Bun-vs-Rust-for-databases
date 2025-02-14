import { PoolClient } from "pg";

const write_to_db: any = async (db: PoolClient, book: any) => {
  const db_cliet: any = await db.connect();
  try {
    await db_cliet.query("BEGIN");
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

    await db_cliet.query(query, values);
    await db_cliet.query("COMMIT");
  } catch (error) {
    console.log(`Error inserting book with key ${book.key}:`, error);
    await db_cliet.query("ROLLBACK");
  } finally {
    await db_cliet.release();
  }
};
export default write_to_db;
