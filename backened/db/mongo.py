from motor.motor_asyncio import AsyncIOMotorClient
from ..core.settings import settings


client = AsyncIOMotorClient(settings.MONGO_URL)
db = client.blog_db
users_collection = db["users"]
posts_collection = db["posts"]


