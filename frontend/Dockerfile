
FROM node:14 AS builder

WORKDIR /frontend_app

COPY package.json .
COPY package-lock.json .

RUN npm install
COPY . .

FROM node:14-slim

RUN ln -snf /usr/share/zoneinfo/Asia/Almaty /etc/localtime && echo "Asia/Almaty" > /etc/timezone

WORKDIR /frontend_app

COPY --from=builder /frontend_app .

EXPOSE 3000

CMD ["npm", "start"]
