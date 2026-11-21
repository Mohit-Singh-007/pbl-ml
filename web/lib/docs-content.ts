export const TOC = [
  { id: "overview", label: "1. The problem" },
  { id: "architecture", label: "2. How the system fits together" },
  { id: "dataset", label: "3. The dataset" },
  { id: "model", label: "4. The model" },
  { id: "evaluation", label: "5. How good is it?" },
  { id: "journey", label: "6. One transaction, step by step" },
  { id: "api", label: "7. The API" },
  { id: "database", label: "8. The database" },
  { id: "frontend", label: "9. The web app" },
  { id: "limits", label: "10. Limits and future work" },
  { id: "qa", label: "11. Viva questions and answers" },
  { id: "glossary", label: "12. Glossary" },
];

export const KEY_NUMBERS: { label: string; value: string }[] = [
  { label: "Transactions in dataset", value: "50,000 (synthetic)" },
  { label: "Fraud share", value: "4% (2,000 frauds)" },
  { label: "Train / test split", value: "80% / 20% (10,000 test rows)" },
  { label: "Input features", value: "10 columns, 12 after encoding" },
  { label: "Random Forest", value: "200 trees, max depth 12" },
  { label: "Random Forest F1 / ROC-AUC", value: "0.587 / 0.986" },
  {
    label: "Verdict bands",
    value: "Safe below 30%, Suspicious 30-70%, Fraud 70%+",
  },
  { label: "Precision when flagged Fraud (70%+)", value: "97.6%" },
  { label: "Recall when flagged at 30%+", value: "71.5%" },
  { label: "Database tables", value: "transactions, predictions" },
];

export const ARCH_STEPS = [
  {
    title: "Web app",
    text: "Next.js pages with shadcn/ui. The person fills in the payment form here.",
  },
  {
    title: "Next.js server routes",
    text: "/api/predict and /api/review pass the request on to Python. This avoids browser security (CORS) problems.",
  },
  {
    title: "FastAPI service",
    text: "Python API. Validates the input, asks the model for a score, builds the reasons, saves everything.",
  },
  {
    title: "Random Forest model",
    text: "A saved file (rf_model.joblib) loaded once when the API starts. It returns a fraud probability.",
  },
];

export const COLUMNS: { name: string; meaning: string; example: string }[] = [
  {
    name: "amount",
    meaning: "How much money is being sent, in rupees.",
    example: "4,000",
  },
  {
    name: "user_avg_amount / amount_ratio",
    meaning:
      "The sender's usual payment size, and today's amount divided by it. A 50x jump is a strong warning sign.",
    example: "4,000 / 500 = 8x",
  },
  {
    name: "hour",
    meaning: "Hour of the day (0-23). Fraud is more common in the small hours.",
    example: "3 (3 AM)",
  },
  {
    name: "txn_type",
    meaning:
      "P2P (person to person), P2M (merchant) or COLLECT (a request asking you to approve a payment).",
    example: "COLLECT",
  },
  {
    name: "is_new_payee",
    meaning: "1 if the sender has never paid this receiver before.",
    example: "1",
  },
  {
    name: "txns_last_hour",
    meaning:
      "How many payments the sender made in the last hour. Many quick payments can mean a drained account.",
    example: "4",
  },
  {
    name: "device_changed",
    meaning:
      "1 if the payment came from a device the sender doesn't normally use.",
    example: "1",
  },
  {
    name: "location_changed",
    meaning: "1 if the location looks unusual for this sender.",
    example: "0",
  },
  {
    name: "account_age_days",
    meaning: "How old the sender's account is. Brand new accounts are riskier.",
    example: "20",
  },
  {
    name: "receiver_reports",
    meaning: "How many fraud complaints have been filed against the receiver.",
    example: "3",
  },
  {
    name: "is_fraud (label)",
    meaning:
      "The answer the model learns from: 1 = fraud, 0 = safe. Only in the training data.",
    example: "1",
  },
];

export const RISK_RULES: { factor: string; why: string }[] = [
  {
    factor: "Paying a new receiver",
    why: "Scammers are almost always someone you've never paid before.",
  },
  {
    factor: "Amount far above the usual",
    why: "Fraudsters want to take as much as they can.",
  },
  {
    factor: "Odd hours (midnight to 4 AM)",
    why: "Victims are less alert and banks less watchful.",
  },
  {
    factor: "New device or unusual location",
    why: "May mean someone else is using the account.",
  },
  {
    factor: "Many payments in one hour",
    why: "Typical of draining an account quickly.",
  },
  {
    factor: "Receiver already reported",
    why: "Repeat offenders reuse the same UPI IDs.",
  },
  {
    factor: "Collect requests",
    why: "Scammers send fake 'refund' requests hoping you approve them by entering your PIN.",
  },
  {
    factor: "Very new sender account",
    why: "Throwaway or mule accounts are young.",
  },
];

export const MODELS: { name: string; idea: string; setup: string }[] = [
  {
    name: "Logistic Regression",
    idea: "Draws one straight boundary between safe and fraud by adding up weighted features. Simple and fast.",
    setup: "Scaled inputs, balanced class weights",
  },
  {
    name: "Decision Tree",
    idea: "A flowchart of yes/no questions (is the amount ratio above 3? is the payee new?). Easy to read but unstable.",
    setup: "Max depth 8, balanced class weights",
  },
  {
    name: "Random Forest",
    idea: "200 different decision trees each vote, and the votes are averaged. Much more stable than one tree.",
    setup: "200 trees, max depth 12, min 5 samples per leaf",
  },
];

export const JOURNEY: { title: string; text: string }[] = [
  {
    title: "You fill in the form",
    text: "On the Check transaction page you enter the payment details, or click an example button.",
  },
  {
    title: "The browser sends it to Next.js",
    text: "The page posts the details to /api/predict, a small server route inside the Next.js app.",
  },
  {
    title: "Next.js forwards it to FastAPI",
    text: "That route calls the Python API at /predict (port 8000). The browser never talks to Python directly.",
  },
  {
    title: "FastAPI checks the input",
    text: "Pydantic confirms the amount is above 0, the hour is 0-23, the type is P2P, P2M or COLLECT, and so on. Bad input gets a 422 error.",
  },
  {
    title: "The model scores it",
    text: "The input becomes the same 12 columns the model was trained on (including amount_ratio). The Random Forest returns a fraud probability between 0 and 1.",
  },
  {
    title: "Verdict and reasons are created",
    text: "Below 0.3 is Safe, 0.3 to 0.7 is Suspicious, 0.7 and above is Fraud. A rule-based function lists the risk factors present, such as 'new device'.",
  },
  {
    title: "The result is saved",
    text: "One database transaction inserts a row into transactions and a linked row into predictions. Either both are saved or neither is.",
  },
  {
    title: "The result comes back",
    text: "The page shows the probability, the verdict, the gauge, a recommended action and the reasons. The Dashboard and Transactions pages now include this payment.",
  },
];

export const ENDPOINTS: { method: string; path: string; purpose: string }[] = [
  {
    method: "POST",
    path: "/predict",
    purpose:
      "Scores one transaction and saves it. Returns probability, verdict, reasons and the saved ids.",
  },
  {
    method: "GET",
    path: "/transactions",
    purpose:
      "Lists saved transactions. Filters: verdict, review_status. Paging: limit and offset.",
  },
  {
    method: "GET",
    path: "/stats",
    purpose:
      "Totals, fraud rate, amount blocked, pending reviews and the last 7 days.",
  },
  {
    method: "PATCH",
    path: "/predictions/{id}/review",
    purpose:
      "Marks a flagged prediction as confirmed fraud, false alarm, or back to pending.",
  },
  {
    method: "GET",
    path: "/model-info",
    purpose:
      "Model comparison, threshold metrics and feature importance for the Insights page.",
  },
  {
    method: "GET",
    path: "/health",
    purpose: "Quick check that the API is running.",
  },
];

export const API_FILES: { file: string; job: string }[] = [
  { file: "main.py", job: "Defines the routes and wires everything together." },
  {
    file: "schemas.py",
    job: "Describes the shape of requests and responses and validates them.",
  },
  {
    file: "model_loader.py",
    job: "Loads the saved model, builds the feature row, returns the probability and verdict.",
  },
  {
    file: "explain.py",
    job: "Turns the input into plain-English risk reasons.",
  },
  {
    file: "db.py",
    job: "Connects to PostgreSQL using DATABASE_URL from .env.",
  },
  {
    file: "crud.py",
    job: "All the SQL: save a prediction, list, stats, update review.",
  },
];

export const TABLES: { name: string; purpose: string; columns: string[] }[] = [
  {
    name: "transactions",
    purpose: "What was submitted: one row per payment checked.",
    columns: [
      "id (primary key)",
      "sender_vpa, receiver_vpa",
      "amount, user_avg_amount",
      "hour, txn_type",
      "is_new_payee, txns_last_hour",
      "device_changed, location_changed",
      "account_age_days, receiver_reports",
      "created_at",
    ],
  },
  {
    name: "predictions",
    purpose: "What the model said about it: one row per transaction.",
    columns: [
      "id (primary key)",
      "transaction_id (foreign key, unique)",
      "fraud_probability",
      "verdict (Safe / Suspicious / Fraud)",
      "reasons (JSONB list)",
      "model_version",
      "review_status (pending / confirmed_fraud / false_positive)",
      "created_at",
    ],
  },
];

export const PAGES: { name: string; path: string; text: string }[] = [
  {
    name: "Dashboard",
    path: "/",
    text: "Totals, fraud rate, amount blocked, a banner for flagged items awaiting review, a 7-day chart and the latest transactions.",
  },
  {
    name: "Check transaction",
    path: "/check",
    text: "The form. Shows probability, verdict, a gauge with the three zones, a recommended action and the reasons. Has three example buttons for demos.",
  },
  {
    name: "Transactions",
    path: "/transactions",
    text: "Every saved transaction with filters and paging. Flagged rows have Confirm fraud and False alarm buttons, with Undo.",
  },
  {
    name: "Model insights",
    path: "/insights",
    text: "The model comparison table, metrics at each threshold, the confusion matrix and the feature importance chart.",
  },
];

export const STACK: { part: string; tech: string; why: string }[] = [
  {
    part: "Model",
    tech: "Python, scikit-learn, pandas",
    why: "Standard, well documented tools for tabular machine learning.",
  },
  {
    part: "API",
    tech: "FastAPI, Pydantic, SQLAlchemy",
    why: "Fast to write, validates input automatically, gives free interactive docs at /docs.",
  },
  {
    part: "Database",
    tech: "PostgreSQL (Neon later)",
    why: "Reliable relational database with safe multi-row saves and JSONB support.",
  },
  {
    part: "Web app",
    tech: "Next.js, Tailwind CSS, shadcn/ui, Recharts",
    why: "Modern React framework with ready-made, accessible components and charts.",
  },
];

export const LIMITS: string[] = [
  "The data is synthetic. The labels come from our own risk rules plus noise, so the scores prove the pipeline works, not how it would perform on real UPI traffic.",
  "Inputs like 'usual amount' and 'transactions in the last hour' are typed in by the user. A real system would calculate them from the account's history.",
  "The reasons are rule-based. They match the model's main features but are not computed from the model itself (SHAP would do that).",
  "There is no login or roles, and the app is not connected to the real UPI network.",
  "The review decisions (confirmed fraud or false alarm) are stored but not yet used to retrain the model.",
];

export const FUTURE: string[] = [
  "Train on real, anonymised transaction data and re-check the thresholds.",
  "Add SHAP so each reason comes from the model's own calculation.",
  "Retrain regularly using the reviewed labels, and track drift as fraud patterns change.",
  "Upload a CSV to score many transactions at once.",
  "Add login with analyst and admin roles.",
  "Deploy: Next.js on Vercel, FastAPI on Render, database on Neon.",
];

export const DEMO: { step: string; expect: string }[] = [
  {
    step: "Open Check transaction and click 'Everyday payment', then Check.",
    expect:
      "Safe, close to 0%. Point at the gauge marker sitting in the green zone.",
  },
  {
    step: "Click 'Needs a closer look', then Check.",
    expect:
      "Suspicious, roughly 30-40%. Read out the two reasons (big amount, new payee).",
  },
  {
    step: "On this same example, switch on 'new device' and check again.",
    expect:
      "The probability jumps. This shows the model responds to each risk factor.",
  },
  {
    step: "Click 'Likely scam', then Check.",
    expect: "Fraud, roughly 90%, with many reasons listed.",
  },
  {
    step: "Open Transactions and filter by 'Needs review'.",
    expect:
      "The flagged rows appear. Click Confirm fraud on one and False alarm on another.",
  },
  {
    step: "Go back to the Dashboard.",
    expect: "Counts, amount blocked and the review banner have updated.",
  },
  {
    step: "Open Model insights.",
    expect:
      "Show the comparison table, threshold table, confusion matrix and the top feature (amount vs usual amount).",
  },
  {
    step: "Show pgAdmin with the transactions and predictions tables.",
    expect: "The same rows are stored, including review_status.",
  },
];

export const QA: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "Project and problem",
    items: [
      {
        q: "What problem does your project solve?",
        a: "It automatically rates a UPI payment as Safe, Suspicious or Fraud, and explains why. This helps a bank or payment app stop or review risky payments before the money is gone.",
      },
      {
        q: "Why did you choose UPI fraud?",
        a: "UPI is used for everyday payments across India, so scams like fake collect requests and payments to unknown receivers affect many people. It is a real, current problem and a natural fit for classification.",
      },
      {
        q: "Is this a real-time system?",
        a: "Each payment is scored in a fraction of a second when you submit it. But it is not connected to the real UPI network. Payments are entered through the form to simulate that.",
      },
      {
        q: "Who would use this?",
        a: "A fraud analyst or risk team at a bank or payment app. They see flagged payments, read the reasons and confirm or reject each flag.",
      },
    ],
  },
  {
    category: "Data",
    items: [
      {
        q: "Why did you use synthetic data?",
        a: "Real UPI transactions are private and not publicly available. We generated 50,000 transactions ourselves so we control every column and can explain exactly how it was made.",
      },
      {
        q: "How did you decide which transactions are fraud?",
        a: "Each transaction gets a hidden risk score from factors like a new payee, a large amount, odd hours and a new device, plus random noise. The riskiest 4% are labelled fraud. The noise means some safe payments look risky and some frauds look normal.",
      },
      {
        q: "Isn't that circular? The model just learns your rules.",
        a: "Partly, yes, and we say so openly. The noise keeps the classes overlapping so it isn't trivial, but the scores show the pipeline works, not real-world accuracy. With real data we would reuse the same pipeline and retrain.",
      },
      {
        q: "Why 4% fraud?",
        a: "Real fraud is much rarer, but with too few frauds the model has little to learn from. 4% is a design choice that is still clearly imbalanced, so we had to use precision and recall instead of accuracy.",
      },
      {
        q: "What is amount_ratio and why does it matter most?",
        a: "It is the payment amount divided by the sender's usual amount. A 500 rupee payment from someone who usually sends 500 is normal, while 25,000 from the same person is a 50x jump. It is the model's top feature at about 24% importance.",
      },
      {
        q: "How did you split the data?",
        a: "80% for training and 20% for testing, 10,000 test rows. The split is stratified, so the test set keeps the same 4% fraud share. The model never sees the test rows while learning.",
      },
      {
        q: "How did you handle class imbalance?",
        a: "We used a stratified split, judged models by precision, recall, F1 and ROC-AUC, and used balanced class weights for Logistic Regression and the Decision Tree. For the Random Forest we removed class weighting because it inflated probabilities and made the Suspicious band almost unused.",
      },
    ],
  },
  {
    category: "The model",
    items: [
      {
        q: "What is a Random Forest, in simple words?",
        a: "It is many decision trees working together. Each tree is trained on a random part of the data and a random set of features, so each makes slightly different mistakes. We take the average of all 200 trees' answers, which is more reliable than any single tree.",
      },
      {
        q: "Why Random Forest and not another model?",
        a: "It works very well on table-style data, needs little tuning, handles different kinds of columns, gives feature importance, and outputs probabilities we can turn into three verdicts. It also won against the two simpler models on F1 and ROC-AUC.",
      },
      {
        q: "Why not deep learning or XGBoost?",
        a: "Our data is a small table, where Random Forest and boosting usually beat deep learning. We chose Random Forest because it is easier to explain. XGBoost is a sensible upgrade, listed in future work.",
      },
      {
        q: "How does the model produce a probability?",
        a: "Each tree gives a fraud estimate for the transaction, and the forest averages those estimates across all 200 trees. A result of 0.91 means the trees strongly agree it looks like fraud.",
      },
      {
        q: "What settings did you use?",
        a: "200 trees, maximum depth 12 and at least 5 samples per leaf. The depth limit and leaf size stop trees from memorising the training data.",
      },
      {
        q: "How do you avoid overfitting?",
        a: "We test on rows the model has never seen, limit tree depth, require at least 5 samples per leaf, and average many trees. If it had just memorised the training data, the test scores would be much worse.",
      },
      {
        q: "What does feature importance tell you?",
        a: "How much each input helped the trees separate fraud from safe. It shows which inputs matter, but not in which direction. For example it says 'new payee' matters, not that 'new payee raises risk'.",
      },
      {
        q: "Is the model comparison fair?",
        a: "Mostly, but not perfectly. Logistic Regression and the Decision Tree use balanced class weights, which makes them flag more payments, so they have high recall and low precision. The Random Forest has no weighting. That is why we also compare ROC-AUC, which does not depend on a cut-off. Random Forest is still best at 0.986.",
      },
    ],
  },
  {
    category: "Evaluation",
    items: [
      {
        q: "Why don't you report accuracy?",
        a: "96% of our transactions are safe, so a model that always says 'safe' would score 96% accuracy while catching zero fraud. Precision and recall show how well we handle the rare fraud class.",
      },
      {
        q: "Explain precision and recall with your numbers.",
        a: "Precision answers: of the payments we flagged, how many were really fraud? Recall answers: of all the real frauds, how many did we catch? At the 70% cut-off, 97.6% of Fraud verdicts are real fraud (precision), and at the 30% cut-off we catch 71.5% of all fraud (recall).",
      },
      {
        q: "Why is recall only 44.5% for the Random Forest?",
        a: "That is at a 0.5 cut-off, which is a strict setting. That's why we have the Suspicious band. Flagging everything at 30% and above raises recall to 71.5%, at a precision of 65.6%.",
      },
      {
        q: "What is ROC-AUC?",
        a: "A score from 0.5 (random guessing) to 1.0 (perfect) for how well the model ranks frauds above safe payments, regardless of cut-off. Our 0.986 means that if you pick one fraud and one safe payment at random, the model gives the fraud a higher score about 98.6% of the time.",
      },
      {
        q: "What is a confusion matrix?",
        a: "A 2x2 table of correct and wrong predictions. For our Random Forest at 0.5: 9,571 safe payments passed correctly, 29 false alarms, 222 frauds missed and 178 frauds caught.",
      },
      {
        q: "Which is worse: a false alarm or a missed fraud?",
        a: "A missed fraud costs the customer money, and a false alarm annoys a genuine user and wastes analyst time. Banks usually tolerate more false alarms than misses, which is why we have a review band rather than only block or allow.",
      },
      {
        q: "Why the thresholds 0.3 and 0.7?",
        a: "Below 0.3 the risk is low. At 0.7 and above, precision is 97.6%, so we are confident enough to block. The middle band goes to a human. These cut-offs are adjustable, and a bank would tune them to its own costs.",
      },
    ],
  },
  {
    category: "System design",
    items: [
      {
        q: "Why separate Python and Next.js?",
        a: "Python is the natural home for the machine learning model, and Next.js is the best fit for the interface. The two talk over a simple API, so each can be changed or deployed without touching the other.",
      },
      {
        q: "Why FastAPI?",
        a: "It is quick to build, validates every request automatically with Pydantic, and generates interactive documentation at /docs, which is also useful for testing.",
      },
      {
        q: "Why does Next.js have its own /api routes?",
        a: "They act as a proxy. The browser only talks to Next.js, so there are no cross-origin (CORS) problems, the Python URL stays on the server, and we can add login checks in one place later.",
      },
      {
        q: "How are the reasons generated?",
        a: "A rule-based function lists the risk factors present, for example 'amount is 8x higher than usual' or 'new device'. They line up with the model's top features, but they don't come from the model itself. SHAP would calculate real per-prediction explanations and is listed as future work.",
      },
      {
        q: "What happens if the input is invalid?",
        a: "Pydantic rejects it with a 422 error before the model runs, for example a negative amount or an hour of 25. The web form shows a clear message.",
      },
      {
        q: "What happens if the API is down?",
        a: "The pages show a 'Can't load data' card with a hint instead of crashing, and the Check page shows an error message.",
      },
    ],
  },
  {
    category: "Database",
    items: [
      {
        q: "Why PostgreSQL?",
        a: "It is a reliable relational database, handles saving related rows safely, supports JSONB for the reasons list, and the same code works on Neon when we deploy.",
      },
      {
        q: "Why two tables?",
        a: "One for what was submitted (transactions) and one for what the model said (predictions). It keeps input and output separate, and lets us re-score the same transaction with a newer model version later.",
      },
      {
        q: "What does review_status do?",
        a: "It records the analyst's decision on a flagged payment: pending, confirmed fraud or false alarm. It is the human feedback loop. Later, those labels could be used to retrain the model on real outcomes.",
      },
      {
        q: "Why save both rows in one database transaction?",
        a: "So the two inserts succeed or fail together. If the second insert failed, we would otherwise be left with a transaction that has no prediction.",
      },
      {
        q: "How will you move to Neon?",
        a: "Create a Neon database, run schema.sql once, and replace the DATABASE_URL in .env with Neon's connection string (ending in sslmode=require). No code changes are needed.",
      },
    ],
  },
  {
    category: "Limits and the future",
    items: [
      {
        q: "What are the limitations?",
        a: "The data is synthetic, some inputs are entered by hand instead of computed from history, the reasons are rule-based, and there is no login or live UPI connection. We state these in the report.",
      },
      {
        q: "How would this work with real data?",
        a: "Keep the pipeline. Replace the generator with real transaction history, compute features like usual amount and recent activity automatically, retrain, re-check the thresholds, and monitor the model for drift.",
      },
      {
        q: "What if fraudsters change their behaviour?",
        a: "Then the model's accuracy would slowly drop (this is called concept drift). The answer is to retrain regularly, using the confirmed and rejected flags from the review queue.",
      },
      {
        q: "What about privacy and security?",
        a: "All data here is fake, so no real personal information is stored. A production system would need login, role-based access, encrypted connections and careful handling of UPI IDs and amounts.",
      },
      {
        q: "What would you improve next?",
        a: "SHAP explanations, retraining from reviewed labels, CSV bulk scoring, login roles and a hosted deployment.",
      },
    ],
  },
];

export const GLOSSARY: { term: string; meaning: string }[] = [
  {
    term: "UPI",
    meaning:
      "Unified Payments Interface: India's instant bank-to-bank payment system.",
  },
  {
    term: "VPA / UPI ID",
    meaning:
      "A payment address like name@okhdfc, used instead of an account number.",
  },
  {
    term: "P2P / P2M",
    meaning: "Person-to-person payment / person-to-merchant payment.",
  },
  {
    term: "Collect request",
    meaning:
      "A request that asks you to approve a payment. Scammers abuse it by pretending it is a refund.",
  },
  {
    term: "Feature",
    meaning: "One input column the model looks at, such as hour or amount.",
  },
  {
    term: "Label",
    meaning: "The correct answer for a training row: fraud or not fraud.",
  },
  {
    term: "Classification",
    meaning: "Predicting a category (here Safe vs Fraud) instead of a number.",
  },
  {
    term: "Train / test split",
    meaning:
      "Teaching the model on one part of the data and grading it on a part it hasn't seen.",
  },
  {
    term: "Overfitting",
    meaning:
      "Memorising the training data so well that new data is handled badly.",
  },
  {
    term: "Class imbalance",
    meaning:
      "Far more safe rows than fraud rows, which makes accuracy misleading.",
  },
  {
    term: "Precision",
    meaning:
      "Of the payments flagged as fraud, the share that really were fraud.",
  },
  {
    term: "Recall",
    meaning: "Of all real frauds, the share the model caught.",
  },
  {
    term: "F1 score",
    meaning:
      "A single number combining precision and recall. High only when both are decent.",
  },
  {
    term: "ROC-AUC",
    meaning:
      "How well the model ranks frauds above safe payments, from 0.5 (guessing) to 1.0 (perfect).",
  },
  {
    term: "Confusion matrix",
    meaning: "A 2x2 table of true/false positives and negatives.",
  },
  { term: "False positive", meaning: "A genuine payment wrongly flagged." },
  { term: "False negative", meaning: "A real fraud that slipped through." },
  {
    term: "Threshold",
    meaning: "The probability cut-off that turns a score into a verdict.",
  },
  {
    term: "One-hot encoding",
    meaning:
      "Turning a category like P2P / P2M / COLLECT into separate 0/1 columns.",
  },
  {
    term: "Feature importance",
    meaning:
      "How much each input contributed to the Random Forest's decisions.",
  },
  {
    term: "REST API / endpoint",
    meaning:
      "A URL the web app calls to ask the Python service to do something.",
  },
  {
    term: "Pydantic",
    meaning:
      "The library that checks incoming data matches the expected format.",
  },
  {
    term: "CORS",
    meaning:
      "A browser security rule that limits which websites can call which servers.",
  },
  {
    term: "Proxy route",
    meaning: "A server route that passes a request along to another server.",
  },
  {
    term: "JSONB",
    meaning:
      "A PostgreSQL column type for storing structured JSON efficiently.",
  },
  {
    term: "SHAP",
    meaning:
      "A method that explains exactly how much each feature pushed a single prediction.",
  },
  {
    term: "Concept drift",
    meaning:
      "When real-world behaviour changes over time and the model gets out of date.",
  },
];
