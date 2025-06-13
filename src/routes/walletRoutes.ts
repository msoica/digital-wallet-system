import express from 'express';
import { topupWallet } from '../controllers/walletController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/topup', protect, topupWallet);

export default router; 