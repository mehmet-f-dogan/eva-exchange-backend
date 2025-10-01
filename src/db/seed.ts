import dotenv from 'dotenv';
dotenv.config();
import { sequelize, Share, SharePrice, Portfolio, Transaction } from '../models';

async function waitForDb(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('Database connected');
      return;
    } catch (err) {
      console.log(`Database not ready, retrying in ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error('Could not connect to the database after several attempts');
}

async function seed() {
    await waitForDb();

    await sequelize.sync({ force: true });

    const shares = await Share.bulkCreate([
        { symbol: 'AAA', name: 'Alpha A' },
        { symbol: 'BBB', name: 'Beta B' },
        { symbol: 'CCC', name: 'Gamma C' },
        { symbol: 'DDD', name: 'Delta D' },
        { symbol: 'EEE', name: 'Epsilon E' }
    ]);


    const now = new Date();
    const prices = [] as any[];
    shares.forEach((s, i) => {
        prices.push({ shareId: s.id, price: (10 + i * 5).toFixed(2), timestamp: now });
    });
    await SharePrice.bulkCreate(prices);


    const portfolios = await Portfolio.bulkCreate([
        { ownerName: 'Alice' },
        { ownerName: 'Bob' },
        { ownerName: 'Carol' },
        { ownerName: 'Dave' },
        { ownerName: 'Eve' }
    ]);


    const txs: any[] = [];
    for (const p of portfolios) {
        txs.push({ portfolioId: p.id, shareId: shares[0].id, type: 'BUY', quantity: 10, price: '10.00' });
        txs.push({ portfolioId: p.id, shareId: shares[0].id, type: 'SELL', quantity: 2, price: '10.00' });
        txs.push({ portfolioId: p.id, shareId: shares[1].id, type: 'BUY', quantity: 5, price: '15.00' });
    }
    await Transaction.bulkCreate(txs);


    console.log('Seed complete');
    process.exit(0);
}


seed().catch(err => { console.error(err); process.exit(1); });