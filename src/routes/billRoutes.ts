import express from 'express';
import { createBill, getBills, payAllBills } from '../controllers/billController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', createBill);
router.get('/', getBills);
router.post('/pay', payAllBills);

export default router; 