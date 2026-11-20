"""
UPI Fraud Detection - FastAPI service (Step 3: with PostgreSQL)
Run:  uvicorn main:app --reload --port 8000
Docs: http://localhost:8000/docs
"""
import json
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import crud
from explain import explain
from model_loader import ML_DIR, MODEL_VERSION, predict_proba, verdict_from
from schemas import Prediction, Review, Transaction

app = FastAPI(title="UPI Fraud Detection API", version="2.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_VERSION}


@app.post("/predict", response_model=Prediction)
def predict(t: Transaction):
    prob = predict_proba(t)
    verdict = verdict_from(prob)
    reasons = explain(t)
    txn_id, pred_id = crud.save_prediction(t, prob, verdict, reasons, MODEL_VERSION)
    return Prediction(transaction_id=txn_id, prediction_id=pred_id,
                      fraud_probability=round(prob, 4), verdict=verdict, reasons=reasons)


@app.get("/transactions")
def transactions(limit: int = 50, offset: int = 0,
                 verdict: Optional[str] = None, review_status: Optional[str] = None):
    return crud.list_transactions(min(limit, 200), offset, verdict, review_status)


@app.get("/stats")
def stats():
    return crud.get_stats()


@app.patch("/predictions/{prediction_id}/review")
def review(prediction_id: int, body: Review):
    if not crud.update_review(prediction_id, body.review_status):
        raise HTTPException(404, "Prediction not found")
    return {"id": prediction_id, "review_status": body.review_status}


@app.get("/model-info")
def model_info():
    with open(ML_DIR / "model" / "metrics.json") as f:
        return json.load(f)