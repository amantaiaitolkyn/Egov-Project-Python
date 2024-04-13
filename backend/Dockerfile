FROM python:3.9-slim AS base
ENV PYTHONUNBUFFERED=1 \
    TZ=Asia/Almaty \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

RUN mkdir /appp
ENV PYTHONPATH "${PYTHONPATH}:/appp"
WORKDIR /appp

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip uninstall kafka-lib-tima
RUN pip install kafka-lib-tima

FROM base AS production

COPY . .

# COPY DejaVuSans.ttf /appp/modules/DejaVuSans.ttf

RUN chmod a+x docker/*.sh

CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind=0.0.0.0:8000"]

