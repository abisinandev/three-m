FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=1536" npm run build

EXPOSE 9000

CMD ["npm", "start"]