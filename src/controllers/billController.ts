import { Request, Response } from 'express';
import { User } from '../models/User';
import { Bill } from '../models/Bill';
import { billPaymentQueue } from '../config/queue';

export const createBill = async (req: Request, res: Response) => {
  try {
    const { amount, description, dueDate } = req.body;
    const userId = req.user?._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Amount must be greater than 0',
      });
    }

    const bill = await Bill.create({
      user: userId,
      amount,
      description,
      dueDate: new Date(dueDate),
    });

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: bill,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBills = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const bills = await Bill.find({ user: userId }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      data: bills,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const payAllBills = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const pendingBills = await Bill.find({
      user: userId,
      status: 'pending',
    }).sort({ dueDate: 1 });

    if (pendingBills.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending bills to pay',
        data: {
          pendingBills: [],
        },
      });
    }

    const job = await billPaymentQueue.add(
      {
        userId,
        billIds: pendingBills.map(bill => bill._id),
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      }
    );

    res.status(202).json({
      success: true,
      message: 'Bill payment processing started',
      data: {
        jobId: job.id,
        pendingBills: pendingBills.length,
        totalAmount: pendingBills.reduce((sum, bill) => sum + bill.amount, 0),
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}; 