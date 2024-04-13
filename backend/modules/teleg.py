import asyncio

import dbase as _dbase
import modules.model as _model
import modules.services as _services
import requests
from aiogram import Bot, Dispatcher, types


async def connect_to_db():
    await _dbase.DB.connect()

async def disconnect_from_db():
    await _dbase.DB.disconnect()

TELEGRAM_BOT_TOKEN = '6897226082:AAHIKd83Se06Bp-8dd0NKaM-Dw_qffjam2c'

api_url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendDocument'

bot = Bot(token=TELEGRAM_BOT_TOKEN)
dp = Dispatcher(bot)

async def on_startup(dp):
    await connect_to_db()

async def on_shutdown(dp):
    await disconnect_from_db()
    
@dp.message_handler(commands=['start'])
async def start(message: types.Message):
    await message.answer('Welcome to egov bot!Send your username from egov')

async def send_pdf_bot(chat_id: str):
    with open(_services.PDF_PATH, 'rb') as file:
        files = {'document': ('output.pdf', file)}
        params = {'chat_id': chat_id, 'caption': 'This is your results for request'}
        response = requests.post(api_url, params=params, files=files)
        if response.status_code == 200:
            print('Document sent successfully!')
        else:
            print(f'Failed to send document. Status code: {response.status_code}, Response: {response.text}')

@dp.message_handler(lambda message: not message.text.startswith('/'))
async def start(message: types.Message):
    user_id = message.from_user.id
    username = message.text
    res = await save_username(username, user_id)
    if res:
        await message.answer(f'Thank you, {username}! Your username has been saved.')
    else:
        await message.answer(f'Your username already exist')
    
async def save_username(username, user_id):
    query = _model.telegram_users.select().where(_model.telegram_users.c.username == username)
    existing_user = await _dbase.DB.fetch_one(query)

    if existing_user:
        return False 
    else:
        query1 = _model.telegram_users.insert().values(username=username, chat_id=str(user_id))
        await _dbase.DB.execute(query1)
        return True

async def main():
    await connect_to_db()
    await dp.start_polling()
    await disconnect_from_db()

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(main())
    loop.run_forever()
