from typing import List
from schemas import Transaction


def explain(t: Transaction) -> List[str]:
    """Simple rule-based reasons that mirror the model's top features."""
    r = []
    ratio = t.amount / t.user_avg_amount
    if ratio > 3:
        r.append(f"Amount is {ratio:.1f}x higher than the user's usual amount")
    if t.is_new_payee:
        r.append("Payment to a new/never-paid receiver")
    if t.device_changed:
        r.append("Transaction from a new device")
    if t.location_changed:
        r.append("Unusual location")
    if t.hour <= 4:
        r.append(f"Odd hour ({t.hour}:00 AM)")
    if t.txns_last_hour >= 3:
        r.append(f"{t.txns_last_hour} transactions in the last hour (rapid activity)")
    if t.receiver_reports > 0:
        r.append(f"Receiver has {t.receiver_reports} past fraud report(s)")
    if t.txn_type == "COLLECT":
        r.append("Collect request (common in scams)")
    if t.account_age_days < 30:
        r.append("Very new account")
    return r or ["No risk factors detected"]