FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

EXPOSE 9000

CMD ["npm", "start"]
