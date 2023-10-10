import { Database } from "bun:sqlite";

export const read_all_db = (db: Database, content: any[]) => {
  const stmt2 = db.query("SELECT * FROM books_ts where id = $id");
  content.entries();
  content.forEach((book: any, index: number) => {
    stmt2.all({
      $id: index,
    });
  });
};

export const read_file = async () => {
  try {
    const read = Bun.file("test.json");

    return await read.json();
  } catch (e) {
    console.log("Error parsing test", e);
  }
};
