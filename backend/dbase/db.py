import os

from databases import Database
from fastapi import FastAPI

app = FastAPI()
DATABASE_URL = os.getenv("DATABASE_URL")
DB = Database(DATABASE_URL)
