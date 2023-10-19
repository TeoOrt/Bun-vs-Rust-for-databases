CREATE TABLE IF NOT EXISTS rust_db_migrate(
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    title TEXT NOT NULL,
    cover_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    authors TEXT NOT NULL
);