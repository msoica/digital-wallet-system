import { Request, Response } from 'express';
import { User } from '../models/User';
import { WalletTopup } from '../models/WalletTopup';

export const topupWallet = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user?._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Amount must be greater than 0',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const previousBalance = user.walletValue;
    const newBalance = previousBalance + amount;

    user.walletValue = newBalance;
    await user.save();

    const walletTopup = await WalletTopup.create({
      user: userId,
      amount,
      previousBalance,
      newBalance,
    });

    res.status(200).json({
      success: true,
      message: 'Wallet topped up successfully',
      data: {
        previousBalance,
        amount,
        newBalance,
        topupId: walletTopup._id,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}; 