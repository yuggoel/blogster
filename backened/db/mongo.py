import os
from motor.motor_asyncio import AsyncIOMotorClient


MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://yuggoel543_db_user:sMYtOYUw1xrtwKlQ@cluster0.09bscoc.mongodb.net/")
client = AsyncIOMotorClient(MONGO_URL)
db = client.blog_db
users_collection = db["users"]
posts_collection = db["posts"]


