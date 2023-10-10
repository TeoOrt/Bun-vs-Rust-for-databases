-- Add migration script here
CREATE TABLE IF NOT EXISTS rust_db_migrate(
    id INTEGER PRIMARY KEY,
    key TEXT NOT NULL,
    title TEXT NOL NULL,
    cover_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    authors TEXT NOT NULL
);