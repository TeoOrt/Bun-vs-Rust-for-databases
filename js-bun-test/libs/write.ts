import { Database } from "bun:sqlite";

const write_to_db = (db: Database, content: any[]) => {
  const stmt = db.query(
    "INSERT INTO books_ts (key, title ,cover_id , subject , authors)  values ($key, $title, $cover_id ,$subject ,$authors)"
  );

  try {
    content.forEach((book: any) => {
      stmt.run({
        $key: book.key == null ? "n/a" : book.key,
        $title: book.title,
        $cover_id: book.cover_id,
        $subject: JSON.stringify(book.subject),
        $authors: JSON.stringify(book.authors),
      });
    });
  } catch (e) {
    console.log(e);
  }
};

export default write_to_db;
