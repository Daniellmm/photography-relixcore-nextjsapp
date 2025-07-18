import mongoose, { Schema, models } from 'mongoose';

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  albumId: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
  reference: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  channel: String,
  paidAt: Date,
}, { timestamps: true });

export const Payment = models.Payment || mongoose.model('Payment', PaymentSchema);
