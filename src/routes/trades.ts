import { Router } from 'express';
import { buySell } from '../controllers/tradesController';


const router = Router();


router.post('/', buySell);


export default router;