FROM node:current-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
EXPOSE 4321

ENV HOST=0.0.0.0
ENV PORT=4321

CMD ["npm", "run", "dev", "--", "--host"]