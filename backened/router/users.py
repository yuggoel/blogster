from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from bson import ObjectId

from ..core.security import hash_password, verify_password, create_access_token
from ..core.schemas import UserCreate, Token
from ..db.mongo import users_collection


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/signup", response_model=Token)
async def signup(user: UserCreate):
    existing_user = await users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = hash_password(user.password)
    result = await users_collection.insert_one({"username": user.username, "password": hashed_password})
    access_token = create_access_token({"user_id": str(result.inserted_id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = create_access_token({"user_id": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}


