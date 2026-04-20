from fastapi import HTTPException
from auth import create_token

@app.post("/login")
def login(data: dict):
    email = data.get("email")
    password = data.get("password")

    # 🔥 TEMP HARDCODE (MVP)
    if email == "vishal.pagadala.com" and password == "vik2003":
        token = create_token({"user": email})
        return {"token": token}

    raise HTTPException(status_code=401, detail="Invalid credentials")