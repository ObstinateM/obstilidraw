FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npm run prisma:generate
RUN npm run build
CMD ["npm", "run", "start:prod"]