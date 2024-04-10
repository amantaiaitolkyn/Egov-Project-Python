
from pydantic import BaseModel
from sqlalchemy import (JSON, TIMESTAMP, Boolean, Column, DateTime, ForeignKey,
                        Integer, LargeBinary, MetaData, String, Table,
                        UniqueConstraint)


metadata = MetaData()

users_info = Table(
    "users_info",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("username", String),
    Column("firstname", String),
    Column("lastname", String),
    Column("age", Integer),
    Column("nationality", String, default= "Kazakh"),
    Column("country", String, default= "Kazakhstan"),
    Column("city", String, default= "Almaty"),
    Column("education", String, default= "No education"),
    Column("phone_number", String),
    Column("gender", String),
    Column("birthdate", DateTime),
    Column("telegram_account", String, default= "@username"),
    Column("email", String),
    Column("role_id", Integer, ForeignKey("roles.id")),
)

roles = Table(
    "roles",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String, nullable=False),
    Column("permissions", JSON),
)

telegram_users = Table(
    "telegram_users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("chat_id", String),
    Column("username", String),
    UniqueConstraint("chat_id")
)

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("username", String, nullable=False),
    Column("password", String, nullable=False),
    Column("registered_at", TIMESTAMP),
    Column("role_id", Integer, ForeignKey("roles.id")),
)

requests = Table(
    "requests",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, nullable=False),
    Column("datas_from_users", JSON, nullable=False),
    Column("is_done", Boolean,default= False),
    Column("confirmed",Boolean,default= False),
    Column("type",String,ForeignKey("types.name")),
)

types = Table(
    "types",
    metadata,
    Column("id", Integer),
    Column("name", String, primary_key=True),
)


request2 = Table(
    "request2",
    metadata,
    Column("id", Integer,primary_key=True),
    Column("bin", String),
    Column("data",JSON),
    Column("BEGIN_DATE",DateTime),
    Column("END_DATE",DateTime)
)

class Request2Read(BaseModel):
    username: str
    bin: str
    status: bool

class UserCreate(BaseModel):
    username: str
    password: str
    
class UserRead(BaseModel):
    # id: int
    user_id: int
    username: str
    firstname: str
    lastname: str
    age: int
    nationality: str
    country: str
    city: str
    education: str
    phone_number: str
    gender: str
    birthdate: str
    telegram_account: str
    email: str

class RequestRead(BaseModel):
    user_id: int
    datas_from_users: dict
    is_done: bool
    confirmed: bool

class User(BaseModel):
    username: str

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str = None
