import { Request, Response } from 'express';
import { Share, SharePrice, Portfolio, Transaction, TradeType, sequelize } from '../models';


export async function buySell(req: Request, res: Response) {
    const { portfolioId, symbol, type, quantity } = req.body as {
        portfolioId: number;
        symbol: string;
        type: 'BUY' | 'SELL';
        quantity: number;
    };


    if (!portfolioId || !symbol || !type || !quantity) return res.status(400).send({ error: 'Missing fields' });
    if (!['BUY', 'SELL'].includes(type)) return res.status(400).send({ error: 'Invalid trade type' });
    if (!Number.isInteger(quantity) || quantity <= 0) return res.status(400).send({ error: 'Quantity must be positive integer' });


    const t = await sequelize.transaction();
    try {
        const portfolio = await Portfolio.findByPk(portfolioId, { transaction: t });
        if (!portfolio) {
            await t.rollback();
            return res.status(400).send({ error: 'Portfolio not found' });
        }


        const share = await Share.findOne({ where: { symbol: symbol.toUpperCase() }, transaction: t });
        if (!share) {
            await t.rollback();
            return res.status(400).send({ error: 'Share not registered' });
        }


        const latestPrice = await SharePrice.findOne({ where: { shareId: share.id }, order: [['timestamp', 'DESC']], transaction: t });
        if (!latestPrice) {
            await t.rollback();
            return res.status(400).send({ error: 'No price available for share' });
        }


        const price = latestPrice.price;


        if (type === 'BUY') {
            const tx = await Transaction.create({ portfolioId, shareId: share.id, type: 'BUY', quantity, price }, { transaction: t });
            await t.commit();
            return res.status(201).send({ transaction: tx });
        }


        const [result] = await sequelize.query(
            `SELECT COALESCE(SUM(CASE WHEN type='BUY' THEN quantity ELSE -quantity END),0) as net FROM transactions WHERE portfolio_id = :p AND share_id = :s`,
            { replacements: { p: portfolioId, s: share.id }, transaction: t }
        );


        const net = Number((result as any)[0].net || 0);
        if (net < quantity) {
            await t.rollback();
            return res.status(400).send({ error: 'Insufficient shares to sell', available: net });
        }


        const tx = await Transaction.create({ portfolioId, shareId: share.id, type: 'SELL', quantity, price }, { transaction: t });
        await t.commit();
        return res.status(201).send({ transaction: tx });
    } catch (err) {
        await t.rollback();
        console.error(err);
        return res.status(500).send({ error: 'Internal error' });
    }

}