from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from ..core.security import oauth2_scheme, decode_access_token
from ..core.schemas import PostCreate
from ..core.utils import obj_id_to_str, is_valid_object_id
from ..db.mongo import posts_collection, users_collection


router = APIRouter(prefix="/posts", tags=["posts"])


async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    user = await users_collection.find_one({"_id": ObjectId(payload["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/")
async def create_post(post: PostCreate, current_user: dict = Depends(get_current_user)):
    post_doc = {
        "title": post.title,
        "content": post.content,
        "author_id": str(current_user["_id"]),
    }
    result = await posts_collection.insert_one(post_doc)
    post_doc["id"] = str(result.inserted_id)
    return {"msg": "Post created successfully", "post": post_doc}


@router.get("/")
async def get_all_posts():
    posts_cursor = posts_collection.find()
    posts = []
    async for post in posts_cursor:
        posts.append(obj_id_to_str(post))
    return posts


@router.get("/{post_id}")
async def get_post(post_id: str):
    if not is_valid_object_id(post_id):
        raise HTTPException(status_code=400, detail="Invalid post id")
    post = await posts_collection.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return obj_id_to_str(post)


@router.delete("/{post_id}")
async def delete_post(post_id: str, current_user: dict = Depends(get_current_user)):
    if not is_valid_object_id(post_id):
        raise HTTPException(status_code=400, detail="Invalid post id")
    post = await posts_collection.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post["author_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    await posts_collection.delete_one({"_id": ObjectId(post_id)})
    return {"msg": "Post deleted successfully"}


