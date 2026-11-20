const inrFormat = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const inr = (n: number) => inrFormat.format(n);

export const pct = (p: number, digits = 1) => `${(p * 100).toFixed(digits)}%`;

export const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

export const FEATURE_LABELS: Record<string, string> = {
  amount_ratio: "Amount vs. usual amount",
  amount: "Amount",
  is_new_payee: "New payee",
  device_changed: "New device",
  hour: "Hour of day",
  receiver_reports: "Reports against receiver",
  txns_last_hour: "Transactions in last hour",
  location_changed: "Unusual location",
  account_age_days: "Account age",
  txn_type_COLLECT: "Type: collect request",
  txn_type_P2M: "Type: merchant (P2M)",
  txn_type_P2P: "Type: person (P2P)",
};

export const REVIEW_LABELS: Record<string, string> = {
  pending: "Needs review",
  confirmed_fraud: "Confirmed fraud",
  false_positive: "False alarm",
};
