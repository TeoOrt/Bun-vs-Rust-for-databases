import Database from "bun:sqlite";
import { Author, Author_T, Book, Subject_T } from "../types/types";
type ID = number | bigint;

export const create_table = (db: Database) => {
  db.run(
    `CREATE TABLE IF NOT EXISTS books(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      cover_id INT NOT NULL
    )`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS subjects(
     subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
     subject TEXT NOT NULL UNIQUE  
    )`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS authors(
     author_id INTEGER PRIMARY KEY AUTOINCREMENT,
     author_key      TEXT UNIQUE ,
     name            TEXT UNIQUE
    )`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS book_authors(
     book_id INTEGER,
     author_id INTEGER,
     PRIMARY KEY (book_id,author_id),
     FOREIGN KEY (book_id) REFERENCES books(id),
     FOREIGN KEY (author_id) REFERENCES authors(author_id)
    )`,
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS book_subjects(
     book_id INTEGER,
     subject_id INTEGER,
     PRIMARY KEY (book_id,subject_id),
     FOREIGN KEY (book_id) REFERENCES books(id),
     FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
    )`,
  );
};

export const insert_book = (db: Database, title: string, cover_id: number) => {
  const insert = `INSERT INTO books(title, cover_id) VALUES ( :title , :cover_id );`;
  const statement = db.prepare(insert);
  const result = statement.run({ title, cover_id });
  return result.lastInsertRowid;
};

const insert_author = (db: Database, author_key: string, name: string) => {
  const insert = `INSERT or IGNORE INTO authors(author_key, name) VALUES ( :author_key, :name);`;
  const statement = db.prepare(insert);
  statement.run({ author_key, name });
  const getId = `SELECT author_id from authors WHERE name = :name;`;
  const query = db.prepare(getId);
  const result: Author_T | any = query.get({ name });
  return result.author_id;
};

const insert_subject = (db: Database, subject: string) => {
  const insert = `INSERT or IGNORE INTO subjects(subject) VALUES ( :subject);`;
  const statement = db.prepare(insert);
  statement.run({ subject });

  const getId = `SELECT subject_id from subjects WHERE subject = :subject;`;
  const query = db.prepare(getId);
  const result: any | Subject_T = query.get({ subject });
  return result.subject_id;
};

const link_book_authors = (db: Database, book_id: ID, author_id: ID) => {
  const insert = `INSERT INTO book_authors(book_id , author_id) VALUES (:book_id , :author_id);`;
  const statement = db.prepare(insert);
  const result = statement.run({ book_id, author_id });
  return result.lastInsertRowid;
};
const link_book_subjects = (db: Database, book_id: ID, subject_id: ID) => {
  const insert = `INSERT INTO book_subjects(book_id , subject_id) VALUES (:book_id , :subject_id);`;
  const statement = db.prepare(insert);
  const result = statement.run({ book_id, subject_id });
  return result.lastInsertRowid;
};

export const book_insert = (db: Database, book: Book) => {
  const book_id: ID = insert_book(db, book.title, book.cover_id);
  const author_ids: ID[] = book.authors.map((author) => {
    return insert_author(db, author.key!, author.name!);
  });
  const subject_ids: ID[] = book.subject.map((subject) => {
    return insert_subject(db, subject);
  });

  author_ids.forEach((author_id: ID) => {
    link_book_authors(db, book_id, author_id);
  });
  subject_ids.forEach((subject_id: ID) => {
    link_book_subjects(db, book_id, subject_id);
  });
  return book_id;
};
