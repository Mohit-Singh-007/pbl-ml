import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+psycopg2://postgres:mohit123@localhost:5432/upi_fraud"
)
# pool_pre_ping keeps connections healthy (useful with Neon, which sleeps when idle)
engine = create_engine(DATABASE_URL, pool_pre_ping=True)