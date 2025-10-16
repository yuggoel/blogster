from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# -----------------------------
# 1️⃣ FastAPI App
# -----------------------------
app = FastAPI(title="Blog API with MongoDB Only")

# CORS (allow frontend dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.getenv("FRONTEND_ORIGIN", "*")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .router.users import router as users_router
from .router.posts import router as posts_router


@app.get("/")
def home():
    return {"message": "Welcome to the Blog API with MongoDB Only!"}


app.include_router(users_router)
app.include_router(posts_router)
