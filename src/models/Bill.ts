import mongoose, { Document, Schema } from 'mongoose';

export interface IBill extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  status: 'pending' | 'processing' | 'paid' | 'cancelled';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const billSchema = new Schema<IBill>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'cancelled'],
    default: 'pending',
  },
  dueDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

export const Bill = mongoose.model<IBill>('Bill', billSchema); 