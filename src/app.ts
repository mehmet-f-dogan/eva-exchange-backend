import express from 'express';
import tradesRouter from './routes/trades';


const app = express();
app.use(express.json());


app.use('/api/trades', tradesRouter);


app.get('/health', (req, res) => res.send({ status: 'ok' }));


export default app;