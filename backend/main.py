from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import media
from logging_config import setup_logging

setup_logging()

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(media.router)