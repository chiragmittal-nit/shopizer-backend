import express from 'express';
import { registerUser } from '../controllers/user.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', [auth], (req, res) => {
  res.send(req.user);
});

router.post('/', registerUser);

// router.put();

export default router;
