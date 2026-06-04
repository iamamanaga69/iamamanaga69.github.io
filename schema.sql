DROP TABLE IF EXISTS payments;

CREATE TABLE payments (
id TEXT PRIMARY KEY,
tx_hash TEXT UNIQUE,
plan TEXT,
payment_type TEXT,
expected_amount REAL,
actual_amount REAL,
chain TEXT,
token TEXT,
name TEXT,
email TEXT,
telegram TEXT,
project TEXT,
status TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
