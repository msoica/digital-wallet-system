import mongoose, { Document, Schema } from 'mongoose';

export interface IWalletTopup extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  previousBalance: number;
  newBalance: number;
  createdAt: Date;
}

const walletTopupSchema = new Schema<IWalletTopup>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  previousBalance: {
    type: Number,
    required: true,
  },
  newBalance: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export const WalletTopup = mongoose.model<IWalletTopup>('WalletTopup', walletTopupSchema); 