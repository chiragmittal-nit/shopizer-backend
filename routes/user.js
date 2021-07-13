import express from 'express';
import {
  getAllUsers,
  registerUser,
  updateUserDetails,
  deleteUser,
} from '../controllers/user.js';
import { auth } from '../middleware/auth.js';
import { admin } from './../middleware/admin.js';

const router = express.Router();

router.get('/me', [auth], (req, res) => {
  res.send(req.user);
});

router.get('/', [auth, admin], getAllUsers);
router.post('/', registerUser);
router.put('/:id', [auth], updateUserDetails);
router.delete('/:id', [auth, admin], deleteUser);

// router.put();

export default router;
