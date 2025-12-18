FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g npm@11.7.0
RUN npm install -D ts-node typescript

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD sh -c "npx prisma migrate deploy && npx prisma db seed && npm run dev"