#!/bin/bash
alembic revision -m "Recreatee" &
alembic upgrade head

sleep 5 


cd modules
python3 teleg.py &
cd ..


python3 main.py

