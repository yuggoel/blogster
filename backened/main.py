from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.settings import settings

# -----------------------------
# 1️⃣ FastAPI App
# -----------------------------
app = FastAPI(title="Blog API with MongoDB Only")

# CORS (allow frontend dev server)
cors_origins = list(settings.CORS_ORIGINS)
if settings.FRONTEND_ORIGIN:
    cors_origins.append(settings.FRONTEND_ORIGIN)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins else ["*"],
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
