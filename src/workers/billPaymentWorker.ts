import mongoose from 'mongoose';
import { Job } from 'bull';
import { User } from '../models/User';
import { Bill } from '../models/Bill';
import { billPaymentQueue } from '../config/queue';

interface BillPaymentJob {
  userId: string;
  billIds: string[];
}

export const processBillPayment = async (job: Job<BillPaymentJob>) => {
  const { userId, billIds } = job.data;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    const bills = await Bill.find({
      _id: { $in: billIds },
      user: userId,
      status: 'pending',
    }).session(session);

    if (bills.length === 0) {
      throw new Error('No pending bills found');
    }

    const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

    if (user.walletValue < totalAmount) {
      throw new Error('Insufficient balance');
    }

    await Bill.updateMany(
      { _id: { $in: billIds } },
      { $set: { status: 'processing' } },
      { session }
    );

    user.walletValue -= totalAmount;
    await user.save({ session });

    await Bill.updateMany(
      { _id: { $in: billIds } },
      { $set: { status: 'paid' } },
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      message: 'Bills paid successfully',
      data: {
        userId,
        totalAmount,
        billsPaid: bills.length,
        remainingBalance: user.walletValue,
      },
    };
  } catch (error: any) {
    await session.abortTransaction();

    await Bill.updateMany(
      { _id: { $in: billIds }, status: 'processing' },
      { $set: { status: 'pending' } }
    );

    throw new Error(`Payment processing failed: ${error.message}`);
  } finally {
    session.endSession();
  }
};

export const initializeBillPaymentWorker = () => {
  billPaymentQueue.process(async (job) => {
    try {
      return await processBillPayment(job);
    } catch (error: any) {
      console.error('Bill payment processing error:', error);
      throw error;
    }
  });

  billPaymentQueue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed:`, result);
  });

  billPaymentQueue.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed:`, error);
  });
}; 