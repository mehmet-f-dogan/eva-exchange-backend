import request from 'supertest';
import app from '../src/app';
import { sequelize, Share, SharePrice, Portfolio, Transaction } from '../src/models';


beforeAll(async () => {
    await sequelize.sync({ force: true });


    const s = await Share.create({ symbol: 'XYZ', name: 'X Y Z' });
    await SharePrice.create({ shareId: s.id, price: '12.50' });


    const p = await Portfolio.create({ ownerName: 'Tester' });
    (global as any).testPortfolioId = p.id;
    (global as any).testShareSymbol = 'XYZ';
});


afterAll(async () => {
    await sequelize.close();
});


test('BUY should create transaction at latest price', async () => {
    const res = await request(app)
        .post('/api/trades')
        .send({ portfolioId: (global as any).testPortfolioId, symbol: (global as any).testShareSymbol, type: 'BUY', quantity: 3 });


    expect(res.status).toBe(201);
    expect(res.body.transaction).toBeDefined();
    expect(res.body.transaction.type).toBe('BUY');
    const tx = await Transaction.findByPk(res.body.transaction.id);
    expect(tx).not.toBeNull();
    expect(tx!.quantity).toBe(3);
});


test('SELL should fail when insufficient shares', async () => {
    const res = await request(app)
        .post('/api/trades')
        .send({ portfolioId: (global as any).testPortfolioId, symbol: (global as any).testShareSymbol, type: 'SELL', quantity: 10 });


    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Insufficient/);
});


test('SELL should succeed when sufficient', async () => {
    // buy 5
    await request(app).post('/api/trades').send({ portfolioId: (global as any).testPortfolioId, symbol: (global as any).testShareSymbol, type: 'BUY', quantity: 7 });


    const res = await request(app).post('/api/trades').send({ portfolioId: (global as any).testPortfolioId, symbol: (global as any).testShareSymbol, type: 'SELL', quantity: 5 });
    expect(res.status).toBe(201);
    expect(res.body.transaction.type).toBe('SELL');
});