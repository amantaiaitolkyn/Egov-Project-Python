from datetime import datetime

import modules.model as _model
from dbase import DB
from fastapi import APIRouter, HTTPException
from sqlalchemy import update

router = APIRouter()

@router.get("/requests")
async def get_all_requests():
    query = "SELECT * FROM requests"
    results = await DB.fetch_all(query=query)
    return results

@router.get("/requests/{request_id}")
async def get_request(request_id: int):
    query = _model.requests.select().where(_model.requests.c.id == request_id)
    result = await DB.fetch_one(query=query)
    if result is None:
        raise HTTPException(status_code=404, detail="Request not found")
    return result


@router.put("/confirm")
async def confirm_status(request: _model.RequestRead):
    update_query = (
        update(_model.requests)
        .where(_model.requests.c.user_id == request.user_id)  
        .values(is_done=True,confirmed = True)
    )
    print(request.datas_from_users)
    await DB.execute(update_query)
    
    user_info_query = (
        update(_model.users_info)
        .where(_model.users_info.c.user_id == request.user_id) 
        .values(
            firstname=request.datas_from_users["firstname"],
            lastname=request.datas_from_users["lastname"],
            age=request.datas_from_users["age"],
            nationality=request.datas_from_users["nationality"],
            country=request.datas_from_users["country"],
            city=request.datas_from_users["city"],
            education=request.datas_from_users["education"],
            phone_number=request.datas_from_users["phone_number"],
            gender=request.datas_from_users["gender"],
            birthdate=datetime.strptime(request.datas_from_users["birthdate"], "%Y-%m-%d"),
            telegram_account=request.datas_from_users["telegram_account"],
            email=request.datas_from_users["email"]
        )
    )
    await DB.execute(user_info_query)
    return {"message": "Status confirmed and user_info updated"}

@router.put("/reject")
async def reject_status(request: _model.RequestRead):
    update_query = (
        update(_model.requests)
        .where(_model.requests.c.user_id == request.user_id)  
        .values(confirmed = False,is_done = True)
    )
    await DB.execute(update_query)
    return {"message": "Request rejected"}