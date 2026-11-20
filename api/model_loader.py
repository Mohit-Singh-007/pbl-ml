from pathlib import Path
import joblib
import pandas as pd
from schemas import Transaction

ML_DIR = Path(__file__).resolve().parent.parent / "ml"
_bundle = joblib.load(ML_DIR / "model" / "rf_model.joblib")
MODEL = _bundle["model"]
COLUMNS = _bundle["columns"]
MODEL_VERSION = "rf-v1"


def verdict_from(p: float) -> str:
    """Safe < 0.3 <= Suspicious < 0.7 <= Fraud"""
    return "Safe" if p < 0.3 else "Suspicious" if p < 0.7 else "Fraud"


def to_features(t: Transaction) -> pd.DataFrame:
    row = {
        "amount": t.amount,
        "hour": t.hour,
        "is_new_payee": int(t.is_new_payee),
        "txns_last_hour": t.txns_last_hour,
        "device_changed": int(t.device_changed),
        "location_changed": int(t.location_changed),
        "account_age_days": t.account_age_days,
        "receiver_reports": t.receiver_reports,
        "amount_ratio": round(t.amount / t.user_avg_amount, 3),
        "txn_type_COLLECT": t.txn_type == "COLLECT",
        "txn_type_P2M": t.txn_type == "P2M",
        "txn_type_P2P": t.txn_type == "P2P",
    }
    return pd.DataFrame([row])[COLUMNS]


def predict_proba(t: Transaction) -> float:
    return float(MODEL.predict_proba(to_features(t))[0][1])