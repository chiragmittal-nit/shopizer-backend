import express from 'express';
import {
  getOrdersByUserId,
  placeOrder,
  getAllOrders,
} from './../controllers/order.js';
import { auth } from './../middleware/auth.js';
import { admin } from './../middleware/admin.js';

const router = express.Router();

router.get('/', [auth, admin], getAllOrders);
router.get('/user', [auth], getOrdersByUserId);
router.post('/', [auth], placeOrder);
export default router;
