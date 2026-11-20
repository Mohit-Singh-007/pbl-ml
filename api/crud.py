import json
from sqlalchemy import text
from db import engine


def save_prediction(t, prob: float, verdict: str, reasons: list, model_version: str):
    """Insert transaction + prediction in ONE database transaction."""
    with engine.begin() as conn:
        txn_id = conn.execute(text("""
            INSERT INTO transactions
              (sender_vpa, receiver_vpa, amount, user_avg_amount, hour, txn_type,
               is_new_payee, txns_last_hour, device_changed, location_changed,
               account_age_days, receiver_reports)
            VALUES
              (:sender_vpa, :receiver_vpa, :amount, :user_avg_amount, :hour, :txn_type,
               :is_new_payee, :txns_last_hour, :device_changed, :location_changed,
               :account_age_days, :receiver_reports)
            RETURNING id"""), t.model_dump()).scalar_one()
        pred_id = conn.execute(text("""
            INSERT INTO predictions
              (transaction_id, fraud_probability, verdict, reasons, model_version)
            VALUES (:tid, :p, :v, CAST(:r AS JSONB), :mv)
            RETURNING id"""),
            {"tid": txn_id, "p": round(prob, 4), "v": verdict,
             "r": json.dumps(reasons), "mv": model_version}).scalar_one()
    return txn_id, pred_id


def list_transactions(limit=50, offset=0, verdict=None, review_status=None):
    where, params = [], {"limit": limit, "offset": offset}
    if verdict:
        where.append("p.verdict = :verdict"); params["verdict"] = verdict
    if review_status:
        where.append("p.review_status = :rs"); params["rs"] = review_status
    clause = ("WHERE " + " AND ".join(where)) if where else ""
    sql = f"""
        SELECT t.id AS transaction_id, p.id AS prediction_id, t.sender_vpa, t.receiver_vpa,
               t.amount, t.hour, t.txn_type, t.is_new_payee, t.device_changed,
               t.location_changed, p.fraud_probability, p.verdict, p.reasons,
               p.review_status, t.created_at
        FROM transactions t JOIN predictions p ON p.transaction_id = t.id
        {clause}
        ORDER BY t.created_at DESC LIMIT :limit OFFSET :offset"""
    with engine.connect() as conn:
        rows = conn.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows]


def get_stats():
    with engine.connect() as conn:
        totals = conn.execute(text("""
            SELECT COUNT(*) AS total,
                   COUNT(*) FILTER (WHERE verdict='Safe')       AS safe,
                   COUNT(*) FILTER (WHERE verdict='Suspicious') AS suspicious,
                   COUNT(*) FILTER (WHERE verdict='Fraud')      AS fraud,
                   COUNT(*) FILTER (WHERE review_status='pending' AND verdict <> 'Safe') AS pending_review,
                   COALESCE(SUM(t.amount) FILTER (WHERE verdict='Fraud'), 0) AS amount_blocked
            FROM predictions p JOIN transactions t ON t.id = p.transaction_id
        """)).mappings().one()
        daily = conn.execute(text("""
            SELECT DATE(t.created_at) AS day,
                   COUNT(*) AS total,
                   COUNT(*) FILTER (WHERE verdict <> 'Safe') AS flagged
            FROM predictions p JOIN transactions t ON t.id = p.transaction_id
            WHERE t.created_at >= NOW() - INTERVAL '7 days'
            GROUP BY 1 ORDER BY 1""")).mappings().all()
    t = dict(totals)
    t["amount_blocked"] = float(t["amount_blocked"])
    t["fraud_rate"] = round((t["fraud"] / t["total"]) * 100, 2) if t["total"] else 0.0
    return {**t, "daily": [{"day": str(d["day"]), "total": d["total"], "flagged": d["flagged"]} for d in daily]}


def update_review(prediction_id: int, status: str):
    with engine.begin() as conn:
        res = conn.execute(text(
            "UPDATE predictions SET review_status=:s WHERE id=:id RETURNING id"),
            {"s": status, "id": prediction_id}).first()
    return res is not None