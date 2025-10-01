# EvaExchange Backend


Node + Express + TypeScript + Sequelize + Postgres


### Features
- Register shares (symbol must be 3 uppercase letters)
- Record hourly price updates (DECIMAL with 2 decimals)
- BUY and SELL endpoints that use the latest price from DB
- SELL validates sufficient holdings by grouping transactions
- Seed script to bulk insert data
- Tests using Jest + supertest (uses sqlite in-memory)
- Dockerfile + docker-compose for Postgres + App


### Quickstart
1. Start: `docker compose up --build`


### Tests
Run `npm test` (uses sqlite in-memory so no Postgres required)


### Postman
Use `postman_collection.json` to import example BUY/SELL calls. Replace portfolioId with seeded portfolio id - Auto Incremented Integer.