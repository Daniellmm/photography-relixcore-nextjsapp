import mongoose, { Schema, models } from 'mongoose';

const ImageSchema = new Schema({
  url: String,
  public_id: String, 
  watermarkUrl: String,
  album: { type: Schema.Types.ObjectId, ref: 'Album' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  visible: { type: Boolean, default: false },
}, { timestamps: true });

// inside models/Image.ts (same file where you define the schema)
export interface IImage {
  _id: mongoose.Types.ObjectId;
  url: string;
  public_id: string;
  watermarkUrl?: string;
  album: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  visible: boolean;
}


export const Image = models.Image || mongoose.model('Image', ImageSchema);

