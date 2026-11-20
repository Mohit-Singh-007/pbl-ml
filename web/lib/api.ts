export const API_URL = process.env.API_URL ?? "http://localhost:8000";

export type Verdict = "Safe" | "Suspicious" | "Fraud";
export type ReviewStatus = "pending" | "confirmed_fraud" | "false_positive";

export type Stats = {
  total: number;
  safe: number;
  suspicious: number;
  fraud: number;
  pending_review: number;
  amount_blocked: number;
  fraud_rate: number;
  daily: { day: string; total: number; flagged: number }[];
};

export type TransactionRow = {
  transaction_id: number;
  prediction_id: number;
  sender_vpa: string | null;
  receiver_vpa: string | null;
  amount: number;
  hour: number;
  txn_type: "P2P" | "P2M" | "COLLECT";
  is_new_payee: boolean;
  device_changed: boolean;
  location_changed: boolean;
  fraud_probability: number;
  verdict: Verdict;
  reasons: string[];
  review_status: ReviewStatus;
  created_at: string;
};

export type ModelInfo = {
  results: {
    model: string;
    precision: number;
    recall: number;
    f1: number;
    roc_auc: number;
    confusion_matrix: number[][];
  }[];
  threshold_metrics: { threshold: number; precision: number; recall: number }[];
  feature_importance: Record<string, number>;
};

type Result<T> = { data: T; error: null } | { data: null; error: string };

/** Server-side GET that never throws, so a page can show a helpful message when the API is down. */
export async function apiGet<T>(path: string): Promise<Result<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok)
      return {
        data: null,
        error: `The API answered with status ${res.status}.`,
      };
    return { data: (await res.json()) as T, error: null };
  } catch {
    return {
      data: null,
      error: `Can't reach the API at ${API_URL}. Start it with: uvicorn main:app --reload --port 8000`,
    };
  }
}
