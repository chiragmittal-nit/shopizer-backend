import express from 'express';

import {
  getAllProducts,
  addProductReview,
  deleteProduct,
  addProduct,
  updateProduct,
} from '../controllers/product.js';
import { auth } from './../middleware/auth.js';
import { admin } from './../middleware/admin.js';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', [auth, admin], addProduct);
router.delete('/:id', [auth, admin], deleteProduct);
router.put('/:id', [auth, admin], updateProduct);

router.post('/add-review/:id', [auth], addProductReview);

export default router;
