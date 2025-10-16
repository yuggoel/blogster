from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from passlib.context import CryptContext

# -----------------------------
# 1️⃣ FastAPI App
# -----------------------------
app = FastAPI(title="Blog Website API")

# -----------------------------
# 2️⃣ Database Setup (SQLite)
# -----------------------------
SQLALCHEMY_DATABASE_URL = "sqlite:///./blog.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# -----------------------------
# 3️⃣ Password Hashing
# -----------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

# -----------------------------
# 4️⃣ Database Models
# -----------------------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    created_at = Column(DateTime, default=func.now())
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")

# Create tables
Base.metadata.create_all(bind=engine)

# -----------------------------
# 5️⃣ Pydantic Schemas
# -----------------------------
class UserCreate(BaseModel):
    username: str
    password: str

class PostCreate(BaseModel):
    title: str
    content: str

# -----------------------------
# 6️⃣ Database Session Dependency
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------
# 7️⃣ Routes
# -----------------------------
@app.get("/")
def home():
    return {"message": "Welcome to the Blog API!"}

# User signup
@app.post("/users/signup")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    new_user = User(username=user.username, password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User created successfully", "user_id": new_user.id}

# Create a blog post
@app.post("/posts/")
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    # temporary: assume author_id = 1 (no login/auth yet)
    new_post = Post(title=post.title, content=post.content, author_id=1)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return {"msg": "Post created successfully", "post": {
        "id": new_post.id,
        "title": new_post.title,
        "content": new_post.content
    }}

# Get all posts
@app.get("/posts/")
def get_all_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()

# Get single post by id
@app.get("/posts/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# Delete a post
@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"msg": "Post deleted successfully"}
