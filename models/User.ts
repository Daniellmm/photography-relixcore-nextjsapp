import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  albums: [{
    type: Schema.Types.ObjectId,
    ref: 'Album',
    default: []
  }],
}, { timestamps: true });

export const User = models.User || mongoose.model('User', UserSchema);
