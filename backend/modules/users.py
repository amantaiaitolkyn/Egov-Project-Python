import modules.model as _model
from dbase import DB
from fastapi import APIRouter, Depends
from modules.services import get_current_user, get_user_information

router = APIRouter()

@router.get("/all/")
async def get_all_users():
    query = "SELECT * FROM users"
    results = await DB.fetch_all(query=query)
    return results

@router.get("/me/")
async def get_user(user: _model.User = Depends(get_current_user)):
    return user


@router.get("/profile/")
async def get_user_info(user: _model.UserRead = Depends(get_user_information)):
    return user
