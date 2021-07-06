import express from 'express';

import { getAllProducts, addProductReview } from '../controllers/product.js';

const router = express.Router();

router.get('/', getAllProducts);

router.post('/add-review', addProductReview);

export default router;
