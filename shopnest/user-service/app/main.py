from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime
import redis
import os

app = FastAPI(title="User Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
mongo_client = MongoClient(
    os.getenv("MONGO_URI", "mongodb://mongo-db:27017")
)
db = mongo_client[os.getenv("MONGO_DB", "shopnest_users")]

# Redis
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis-cache"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "user-service",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/docs")
async def api_docs():
    return {
        "service": "User Service",
        "endpoints": {
            "health": "GET /health",
            "register": "POST /api/auth/register",
            "login": "POST /api/auth/login",
            "profile": "GET /api/users/me"
        }
    }

@app.post("/api/auth/register")
async def register():
    return {"message": "Registration endpoint"}

@app.post("/api/auth/login")
async def login():
    return {"message": "Login endpoint"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4002)
