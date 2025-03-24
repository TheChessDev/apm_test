FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npx prisma migrate deploy

EXPOSE 3000

CMD ["node", "dist/main"]
