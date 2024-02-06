FROM node:18-alpine AS frontend

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# RUN npm run build

CMD ["npm", "run", "dev"]
