import time
from datetime import datetime, timedelta
from functools import wraps

import jwt
import modules.model as _model
import requests
from dbase import DB
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fpdf import FPDF
from modules.mail import send_email
from modules.teleg import send_pdf_bot
from sqlalchemy import select

PDF_PATH = '/appp/output.pdf'
SECRET_KEY = "2e398ac8a4e549cc5928d00f6ff3484f38c0e2c6c214cd7998d3e5922c84b56f6"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# send pdf to email and telegram bot
async def sent_to_email(username):
    query2 = select([_model.users_info.c.email]).where((_model.users_info.c.username == username))
    result2 = await DB.fetch_one(query2)
    email = result2[0]
    send_email(email)


async def sent_to_telegram(username):
    query1 = select([_model.telegram_users.c.chat_id]).where((_model.telegram_users.c.username == username))
    result = await DB.fetch_one(query1)
    chat_id = result[0]
    await send_pdf_bot(chat_id)


# get company information
async def get_data(bin_value):
    current_time = datetime.now()
    query = select([_model.request2.c.data]).where(
        (_model.request2.c.bin == bin_value) & (_model.request2.c.END_DATE > current_time))
    existing_data = await DB.fetch_one(query)
    if existing_data:
        detailed_data = existing_data[0]
    else:
        detailed_data = get_datas(bin_value)
        query = _model.request2.insert().values(bin=bin_value, data=detailed_data, BEGIN_DATE=datetime.now(),
                                                END_DATE=datetime.now() + timedelta(days=1))
        await DB.execute(query)
    return detailed_data


def check_company_by_bin(bin: str, lang: str):
    url = f"https://old.stat.gov.kz/api/juridical/counter/api/?bin={bin}&lang={lang}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            company_exists = data.get("success", False)
            name = data.get("obj", {}).get("name", "")
            return {"exists": company_exists, "Name": name}
        return {"exists": False, "Name": ""}
    except Exception as e:
        print(e)
        return {"exists": False, "Name": ""}


def get_datas(bin_iin, lang='en'):
    api_url = f'https://old.stat.gov.kz/api/juridical/counter/api/?bin={bin_iin}&lang={lang}'
    print(api_url)
    try:
        response = requests.get(api_url)
        if response.status_code == 429:
            time.sleep(20)
            response = requests.get(api_url)
        response.raise_for_status()
        return response.json().get("obj", {})
    except requests.exceptions.RequestException as e:
        print(f"Error during API request: {e}")
        return {}


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
        token_data = _model.TokenData(username=username)
    except jwt.ExpiredSignatureError:
        raise credentials_exception
    return token_data


async def get_user_information(tokendata: _model.TokenData = Depends(get_current_user)):
    username = tokendata.username
    print(username)
    query = _model.users_info.select().where(_model.users_info.c.username == username)  # Adjust this line
    try:
        user = await DB.fetch_one(query)
        print(user)
        return user
    except Exception as e:
        print(f"Error fetching user: {e}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


# checking the status of the request2
def check_is_done():
    def decorator(func):
        @wraps(func)
        async def wrapper(user: _model.UserRead, user_info: _model.UserRead = Depends(get_user_information)):
            req = _model.requests.select().where(_model.requests.c.user_id == user_info.user_id)
            exist = await DB.fetch_one(query=req)

            if exist is None:
                return await func(user, user_info)
            else:
                query = select([_model.requests.c.is_done]).where(_model.requests.c.user_id == user_info.user_id)
                query1 = select([_model.requests.c.confirmed]).where(_model.requests.c.user_id == user_info.user_id)
                is_done = await DB.fetch_one(query)
                confirm = await DB.fetch_one(query1)
                if (is_done and confirm) or (not is_done and not confirm):
                    raise HTTPException(status_code=400, detail="already exists")
                else:
                    return await func(user, user_info)

        return wrapper

    return decorator


# Function to generate PDF
def generate_pdf(data):
    pdf = initialize_pdf()
    add_data_to_pdf(pdf, data)
    save_pdf(pdf)


# Initialize PDF and set font
def initialize_pdf():
    pdf = FPDF()
    pdf.add_page()
    pdf.add_font('DejaVuSans', '', '/appp/DejaVuSans.ttf', uni=True)
    pdf.set_font("DejaVuSans", size=12)
    return pdf


# Add data to PDF
def add_data_to_pdf(pdf, data):
    fields = [
        ("BIN/IIN", "bin"),
        ("Name", "name"),
        ("Registration Date", "registerDate"),
        ("Main code of the GCoEA", "okedCode"),
        ("Type of Economic Activity", "okedName"),
        ("Secondary code of the GCoEA", "secondOkeds"),
        ("Code of CoDE", "krpCode"),
        ("Name of CoDE", "krpName"),
        ("Code of CoDE (excluding branches)", "krpBfCode"),
        ("Name of CoDE", "krpBfName"),
        ("CoATO", "kseCode"),
        ("Name of the economic sector", "kseName"),
        ("KFP code", "kfsCode"),
        ("KFP name", "kfsName"),
        ("CoATO", "katoCode"),
        ("CoATO Id", "katoId"),
        ("Legal address", "katoAddress"),
        ("Surname, name, patronymic of the head", "fio")
    ]
    for label, key in fields:
        value = data.get(key, "N/A")
        text = f"{label}: {value}"
        pdf.multi_cell(0, 10, txt=text)


# Save PDF to specified path
def save_pdf(pdf):
    pdf.output(PDF_PATH)


def delivery_callback(err, msg):
    if err is not None:
        print(f'Message delivery failed: {err}')
    else:
        print(f'Message delivered to {msg.topic()} [{msg.partition()}]')
