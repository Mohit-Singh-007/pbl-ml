"""
UPI Fraud Detection - Step 1: synthetic data + model training
Run:  python train.py
Outputs: data/upi_transactions.csv, model/rf_model.joblib, model/metrics.json
"""
import json
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (classification_report, confusion_matrix,
                             f1_score, precision_score, recall_score,
                             roc_auc_score)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.tree import DecisionTreeClassifier

RNG = np.random.default_rng(42)
N = 50_000

# ---------------------------------------------------------------- 1. DATA
def generate_dataset(n=N):
    txn_type = RNG.choice(["P2P", "P2M", "COLLECT"], size=n, p=[0.45, 0.45, 0.10])
    user_avg_amount = RNG.lognormal(mean=6.2, sigma=0.7, size=n)       # ~Rs 500 typical
    amount = user_avg_amount * RNG.lognormal(mean=0.0, sigma=0.8, size=n)
    amount = np.round(amount, 2)

    hour = np.where(RNG.random(n) < 0.08,
                    RNG.integers(0, 5, n),                              # late-night txns
                    RNG.integers(6, 24, n))
    is_new_payee = (RNG.random(n) < 0.25).astype(int)
    txns_last_hour = RNG.poisson(0.6, n)
    device_changed = (RNG.random(n) < 0.05).astype(int)
    location_changed = (RNG.random(n) < 0.08).astype(int)
    account_age_days = RNG.integers(5, 2000, n)
    receiver_reports = RNG.poisson(0.15, n)                             # past complaints vs receiver
    amount_ratio = amount / user_avg_amount

    df = pd.DataFrame({
        "amount": amount,
        "hour": hour,
        "txn_type": txn_type,
        "is_new_payee": is_new_payee,
        "txns_last_hour": txns_last_hour,
        "device_changed": device_changed,
        "location_changed": location_changed,
        "account_age_days": account_age_days,
        "receiver_reports": receiver_reports,
        "amount_ratio": np.round(amount_ratio, 3),
    })

    # Hidden risk score -> fraud label. Noise makes classes overlap (not trivially separable).
    risk = (
        -8.5
        + 2.0 * is_new_payee
        + 2.0 * (amount_ratio > 3)
        + 0.8 * np.log1p(amount_ratio)
        + 2.0 * ((hour <= 4).astype(int))
        + 0.8 * np.clip(txns_last_hour, 0, 6)
        + 2.5 * device_changed
        + 1.5 * location_changed
        + 1.5 * np.clip(receiver_reports, 0, 5)
        + 1.5 * (txn_type == "COLLECT")
        + 1.2 * (account_age_days < 30)
        + RNG.normal(0, 0.8, n)
    )
    # Top ~4% riskiest transactions (after noise) are labelled fraud -> realistic but learnable
    threshold = np.quantile(risk, 0.96)
    df["is_fraud"] = (risk > threshold).astype(int)
    return df


# --------------------------------------------------------------- 2. TRAIN
def prepare(df):
    X = pd.get_dummies(df.drop(columns="is_fraud"), columns=["txn_type"])
    return X, df["is_fraud"]


def evaluate(name, model, Xte, yte):
    pred = model.predict(Xte)
    proba = model.predict_proba(Xte)[:, 1]
    return {
        "model": name,
        "precision": round(precision_score(yte, pred), 4),
        "recall": round(recall_score(yte, pred), 4),
        "f1": round(f1_score(yte, pred), 4),
        "roc_auc": round(roc_auc_score(yte, proba), 4),
        "confusion_matrix": confusion_matrix(yte, pred).tolist(),
    }


def main():
    os.makedirs("data", exist_ok=True)
    os.makedirs("model", exist_ok=True)

    df = generate_dataset()
    df.to_csv("data/upi_transactions.csv", index=False)
    print(f"Dataset: {len(df)} rows | fraud rate = {df.is_fraud.mean():.2%}")

    X, y = prepare(df)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    models = {
        "Logistic Regression": make_pipeline(StandardScaler(),
                                             LogisticRegression(max_iter=1000, class_weight="balanced")),
        "Decision Tree": DecisionTreeClassifier(max_depth=8, class_weight="balanced", random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=200, max_depth=12, min_samples_leaf=5,
                                                n_jobs=-1, random_state=42),
    }

    results = []
    for name, m in models.items():
        m.fit(Xtr, ytr)
        results.append(evaluate(name, m, Xte, yte))

    print("\n=== Model comparison ===")
    print(pd.DataFrame(results).drop(columns="confusion_matrix").to_string(index=False))

    rf = models["Random Forest"]
    print("\n=== Random Forest report ===")
    print(classification_report(yte, rf.predict(Xte), target_names=["Safe", "Fraud"]))

    importance = (pd.Series(rf.feature_importances_, index=X.columns)
                  .sort_values(ascending=False).round(4))
    print("=== Feature importance ===")
    print(importance.to_string())

    # Precision/recall at the cut-offs used by the app (0.3 = flagged, 0.5, 0.7 = fraud)
    proba = rf.predict_proba(Xte)[:, 1]
    threshold_metrics = [
        {"threshold": t,
         "precision": round(precision_score(yte, proba >= t), 4),
         "recall": round(recall_score(yte, proba >= t), 4)}
        for t in (0.3, 0.5, 0.7)
    ]
    print("\n=== Metrics by threshold ===")
    print(pd.DataFrame(threshold_metrics).to_string(index=False))

    joblib.dump({"model": rf, "columns": list(X.columns)}, "model/rf_model.joblib")
    with open("model/metrics.json", "w") as f:
        json.dump({"results": results,
                   "threshold_metrics": threshold_metrics,
                   "feature_importance": importance.to_dict()}, f, indent=2)
    print("\nSaved model/rf_model.joblib and model/metrics.json")


def verdict(p):
    """Used later by the API: Safe < 0.3 <= Suspicious < 0.7 <= Fraud"""
    return "Safe" if p < 0.3 else "Suspicious" if p < 0.7 else "Fraud"


if __name__ == "__main__":
    main()