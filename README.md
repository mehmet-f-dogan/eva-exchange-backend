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


### Quickstart (dev)
1. Copy `.env.example` to `.env` and adjust.
2. Install deps: `npm ci`
3. Seed DB: `npm run migrate-and-seed` (or via docker-compose: `docker compose up --build` then run `npm run migrate-and-seed` inside container)
4. Start: `npm run dev`


### Tests
Run `npm test` (uses sqlite in-memory so no Postgres required)


### Postman
Use `postman_collection.json` to import example BUY/SELL calls. Replace `<PORTFOLIO_ID>` with seeded portfolio id.