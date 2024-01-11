
from datetime import datetime

import modules.model as _model
from dbase.db import DB
from fastapi import APIRouter, HTTPException, status
from modules.services import create_access_token
from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register/", response_model=_model.Token)
async def register(user: _model.UserCreate):
    query = _model.users.select().where(_model.users.c.username == user.username)
    existing_user = await DB.fetch_one(query)

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = pwd_context.hash(user.password)

    role_id = 1
    registered_at = datetime.now()

    query = _model.users.insert().values(username=user.username, password=hashed_password,registered_at = registered_at, role_id = role_id).returning(_model.users.c.id)
    user_id = await DB.execute(query)
    query1 = _model.users_info.insert().values(
        user_id=user_id,
        username=user.username,
        role_id = role_id,
        nationality="Kazakh",
        country= "Kazakhstan",
        city= "Almaty",
        education = "No education")
    result1 = await DB.execute(query1)
   
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "greeting": user.username}

@router.post("/login/", response_model= _model.Token)
async def login_for_access_token(user1: _model.UserCreate):
    query = _model.users.select().where(_model.users.c.username == user1.username)
    user = await DB.fetch_one(query)
    if user is None or not pwd_context.verify(user1.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
    
    return {"access_token": create_access_token(data={"username": user1.username}), "token_type": "bearer", "greting" : user["username"]}

