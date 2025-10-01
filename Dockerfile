FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
RUN npm run build
EXPOSE 3000

CMD ["sh", "-c", "\
  ./wait-for-it.sh db:5432 --timeout=60 --strict && \
  npm run migrate-and-seed && \
  node dist/src/server.js"]
