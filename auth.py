from jose import jwt
from datetime import datetime, timedelta

SECRET = "secretkey"
ALGO = "HS256"

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=2)
    return jwt.encode(payload, SECRET, algorithm=ALGO)

def verify_token(token: str):
    return jwt.decode(token, SECRET, algorithms=[ALGO])