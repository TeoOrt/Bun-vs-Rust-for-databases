import { expect, test } from "bun:test";
import { concatArrayBuffers, resolve } from "bun";
import Database from "bun:sqlite";
import { describe, it } from "bun:test";
import { book_insert, create_table, insert_book } from "./libs/database";

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

test("Create DB", () => {
  const db: Database = new Database(":memory:");
  create_table(db);
  db.close();
});

test("Insert to book", () => {
  const db: Database = new Database(":memory:", { strict: true });
  create_table(db);
  const id_inserted: number | bigint = insert_book(db, "TEST", 69);
  const id_inserted2: number | bigint = insert_book(db, "T1EST", 69);

  const query = db.query(`SELECT title from books`);
  const res = query.all();
  expect(res[0].title).toBe("TEST");
  db.close();
});

test("Insert Book", () => {
  const db: Database = new Database(":memory:", { strict: true });
  create_table(db);
  const book: Book = {
    subject: ["Math", "Science"],
    key: "10",
    title: "No Way",
    cover_id: 99,
    authors: [{ key: "TESTKEY", name: "TESTNAME" }],
  };
  const book_id = book_insert(db, book);

  const query = db.query(`SELECT subjects.subject 
                          FROM book_subjects
                          JOIN subjects ON book_subjects.subject_id = subjects.subject_id
                          WHERE book_subjects.book_id = ?;
                         `);
  const query_result = query.all(book_id);

  const query_authors = db.query(`SELECT authors.name
                          FROM book_authors
                          JOIN authors ON book_authors.author_id = authors.author_id
                          WHERE book_authors.book_id = ?;
                         `);

  const query_result_auth = query.all(book_id);
  console.log(query_result_auth);

  const res: Book = {
    subject: query_result.map((value: any) => {
      return value.subject;
    }),
    key: "10",
    title: "No Way",
    cover_id: 99,
    authors: query_result_auth.map((value: any) => {
      return { name: value.name, key: "TESTKEY" };
    }),
  };
  console.log(res);
  expect(res.subject).toBeArray();
  expect(res.subject).toBeArrayOfSize(2);
  db.close();
});
