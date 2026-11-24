

CREATE TABLE IF NOT EXISTS transactions (
    id                SERIAL PRIMARY KEY,
    sender_vpa        VARCHAR(100),
    receiver_vpa      VARCHAR(100),
    amount            NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    user_avg_amount   NUMERIC(12,2) NOT NULL,
    hour              SMALLINT NOT NULL CHECK (hour BETWEEN 0 AND 23),
    txn_type          VARCHAR(10) NOT NULL CHECK (txn_type IN ('P2P','P2M','COLLECT')),
    is_new_payee      BOOLEAN NOT NULL,
    txns_last_hour    INT NOT NULL DEFAULT 0,
    device_changed    BOOLEAN NOT NULL DEFAULT FALSE,
    location_changed  BOOLEAN NOT NULL DEFAULT FALSE,
    account_age_days  INT NOT NULL DEFAULT 365,
    receiver_reports  INT NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS predictions (
    id                 SERIAL PRIMARY KEY,
    transaction_id     INT NOT NULL UNIQUE REFERENCES transactions(id) ON DELETE CASCADE,
    fraud_probability  NUMERIC(5,4) NOT NULL,
    verdict            VARCHAR(10) NOT NULL CHECK (verdict IN ('Safe','Suspicious','Fraud')),
    reasons            JSONB NOT NULL DEFAULT '[]',
    model_version      VARCHAR(30) NOT NULL DEFAULT 'rf-v1',
    review_status      VARCHAR(20) NOT NULL DEFAULT 'pending'
                       CHECK (review_status IN ('pending','confirmed_fraud','false_positive')),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pred_verdict ON predictions(verdict);
CREATE INDEX IF NOT EXISTS idx_pred_review  ON predictions(review_status);
CREATE INDEX IF NOT EXISTS idx_txn_created  ON transactions(created_at DESC);