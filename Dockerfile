FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x node_modules/.bin/next
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]


