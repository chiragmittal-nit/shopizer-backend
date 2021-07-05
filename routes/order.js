import express from 'express';
import { getOrders, placeOrder } from './../controllers/order.js';

const router = express.Router();

router.get('/', getOrders);
router.post('/', placeOrder);
export default router;
