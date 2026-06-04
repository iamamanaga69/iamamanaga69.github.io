-- D1 Database Schema for FLEXIST Payment Verifier
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    plan TEXT NOT NULL,
    payment_type TEXT NOT NULL,
    expected_amount REAL NOT NULL,
    actual_amount REAL NOT NULL,
    chain TEXT NOT NULL,
    token TEXT NOT NULL,
    tx_hash TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    telegram TEXT NOT NULL,
    project TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'verified',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_tx_hash ON payments(tx_hash);
CREATE INDEX idx_payments_email ON payments(email);
