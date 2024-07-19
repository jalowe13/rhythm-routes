import os
import threading
import logging
from datetime import datetime, time, date
from pydantic import BaseModel
from fastapi import FastAPI, Response, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import random, string
import time as time_module

app = FastAPI()

# Setting up CORS middleware for information being able to be
# accessed from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Setting up logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("Started the server")


API_V = "/api/v1/"

# REST API for generating password
@app.get(f"{API_V}health")
async def health():
    return {"message": "Hello from the server!"}
