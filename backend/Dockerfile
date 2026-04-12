FROM node:current-alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3003

CMD ["node", "index.js"]