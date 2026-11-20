# UPI Fraud Detection

A web app that rates UPI payments as **Safe**, **Suspicious** or **Fraud**, explains why, and stores every decision so an analyst can review it.

Built as an MCA PBL project: a Random Forest model served by a Python API, saved in PostgreSQL, and shown in a Next.js dashboard.

## Features

- **Check transaction:** enter payment details and get a fraud probability, a verdict, a risk gauge and plain-English reasons. Three example buttons are included for demos.
- **Dashboard:** totals, fraud rate, amount blocked, a 7-day chart and the latest transactions.
- **Transactions and review queue:** filter by verdict, then confirm fraud or mark a false alarm (with undo).
- **Model insights:** model comparison, metrics at each threshold, confusion matrix and feature importance.
- **Documentation page:** the whole project explained in simple words, with a presentation plan and viva Q&A (`/documentation`).

## How it works

```
Browser (Next.js pages)
   -> Next.js server routes (/api/predict, /api/review)
      -> FastAPI service (port 8000)
         -> Random Forest model (ml/model/rf_model.joblib)
         -> PostgreSQL (transactions + predictions)
```

| Verdict | Fraud probability |
|---|---|
| Safe | below 30% |
| Suspicious | 30% to 70% |
| Fraud | 70% and above |

## Tech stack

| Part | Technology |
|---|---|
| Model | Python, scikit-learn, pandas |
| API | FastAPI, Pydantic, SQLAlchemy |
| Database | PostgreSQL (Neon for production) |
| Web app | Next.js (App Router), Tailwind CSS, shadcn/ui, Recharts |

## Project structure

```
upi-fraud/
├── ml/                 model training
│   ├── train.py        generates data, trains and compares models
│   ├── data/           synthetic dataset (CSV)
│   └── model/          rf_model.joblib + metrics.json
├── api/                FastAPI service
│   ├── main.py         routes
│   ├── schemas.py      request/response validation
│   ├── model_loader.py loads the model and predicts
│   ├── explain.py      rule-based reasons
│   ├── db.py, crud.py  PostgreSQL connection and queries
│   └── .env.example    copy to .env
├── db/schema.sql       table definitions
└── web/                Next.js + shadcn/ui app
```

## Prerequisites

- Python 3.9 or newer
- Node.js 20 or newer
- PostgreSQL (with pgAdmin, or any client)

## Setup

### 1. Database

1. In pgAdmin, create a database named `upi_fraud`.
2. Open its Query Tool, load `db/schema.sql` and run it. You should see the tables `transactions` and `predictions`.

### 2. API

```bash
cd api
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac / Linux
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and put in your own PostgreSQL username and password:

```
DATABASE_URL=postgresql+psycopg2://YOUR_USER:YOUR_PASSWORD@localhost:5432/upi_fraud
```

If your password contains special characters, URL-encode them (`@` becomes `%40`, `#` becomes `%23`).

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

Check `http://localhost:8000/health`, and try the endpoints at `http://localhost:8000/docs`.

### 3. Web app

```bash
cd web
npm install
```

Create `web/.env.local`:

```
API_URL=http://localhost:8000
```

If you are building the web app from scratch, also install the shadcn components:

```bash
npx shadcn@latest add button card input label switch badge table sonner
npm install recharts lucide-react
```

Start it:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Run order

Every time: start PostgreSQL, then the API (port 8000), then the web app (port 3000).

## Retraining the model (optional)

The trained model is already included. To regenerate the dataset and model:

```bash
cd ml
pip install -r requirements.txt
python train.py
```

This rewrites `data/upi_transactions.csv`, `model/rf_model.joblib` and `model/metrics.json`. Restart the API afterwards so it loads the new model.

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/predict` | Score one transaction and save it |
| GET | `/transactions` | List transactions (`verdict`, `review_status`, `limit`, `offset`) |
| GET | `/stats` | Totals, fraud rate, amount blocked, last 7 days |
| PATCH | `/predictions/{id}/review` | Set `confirmed_fraud`, `false_positive` or `pending` |
| GET | `/model-info` | Metrics and feature importance |
| GET | `/health` | Health check |

## Model results

Trained on 50,000 synthetic transactions (4% fraud), tested on 10,000 unseen rows.

| Model | Precision | Recall | F1 | ROC-AUC |
|---|---|---|---|---|
| Logistic Regression | 0.307 | 0.908 | 0.458 | 0.974 |
| Decision Tree | 0.318 | 0.885 | 0.467 | 0.933 |
| **Random Forest** | **0.860** | **0.445** | **0.587** | **0.986** |

Random Forest metrics at different cut-offs:

| Flag at or above | Precision | Recall |
|---|---|---|
| 30% | 65.6% | 71.5% |
| 50% | 86.0% | 44.5% |
| 70% | 97.6% | 20.5% |

Accuracy is deliberately not reported: 96% of rows are safe, so always predicting "safe" would already score 96%.

## Important note on the data

The dataset is **synthetic**. Fraud labels come from a hidden risk score built from our own rules (new payee, large amount, odd hours, new device and so on) plus random noise. The results show that the pipeline works, not how the model would perform on real UPI traffic. With real data the same pipeline would be retrained.

## Troubleshooting

| Problem | Fix |
|---|---|
| `password authentication failed` | Wrong user or password in `api/.env` |
| `database "upi_fraud" does not exist` | Create it in pgAdmin first |
| `relation "transactions" does not exist` | Run `db/schema.sql` on that database |
| `FileNotFoundError ... rf_model.joblib` | `ml/` must sit next to `api/` with the model file inside |
| `connection refused` | PostgreSQL isn't running, or it uses a different port |
| Web pages show "Can't load data" | The API isn't running on port 8000 |
| Insights page crashes | Replace `ml/model/metrics.json` with the latest version |

## Deploying later

- Database: create a Neon project, run `db/schema.sql`, and set `DATABASE_URL` to Neon's connection string (ending in `?sslmode=require`).
- API: host on Render or Railway with the same environment variable.
- Web: host on Vercel and set `API_URL` to the hosted API address.

## Future work

Real data, SHAP explanations, retraining from reviewed labels, CSV bulk scoring, login roles and Docker Compose.
