import express from 'express';
import { signin, getCurrentUser } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/signin', signin);
router.get('/me', protect, getCurrentUser);

export default router; 