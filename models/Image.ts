import mongoose, { Schema, models } from 'mongoose';

const ImageSchema = new Schema({
  url: String,
  public_id: String, 
  watermarkUrl: String,
  album: { type: Schema.Types.ObjectId, ref: 'Album' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  visible: { type: Boolean, default: false },
}, { timestamps: true });

export const Image = models.Image || mongoose.model('Image', ImageSchema);

