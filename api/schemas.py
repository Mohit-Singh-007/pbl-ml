from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class Transaction(BaseModel):
    sender_vpa: Optional[str] = None
    receiver_vpa: Optional[str] = None
    amount: float = Field(..., gt=0, description="Amount in INR")
    user_avg_amount: float = Field(500, gt=0, description="User's typical txn amount")
    hour: int = Field(..., ge=0, le=23)
    txn_type: Literal["P2P", "P2M", "COLLECT"]
    is_new_payee: bool
    txns_last_hour: int = Field(0, ge=0)
    device_changed: bool = False
    location_changed: bool = False
    account_age_days: int = Field(365, ge=0)
    receiver_reports: int = Field(0, ge=0, description="Past complaints against receiver")


class Prediction(BaseModel):
    transaction_id: int
    prediction_id: int
    fraud_probability: float
    verdict: Literal["Safe", "Suspicious", "Fraud"]
    reasons: List[str]


class Review(BaseModel):
    review_status: Literal["confirmed_fraud", "false_positive", "pending"]