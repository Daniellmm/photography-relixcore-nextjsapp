import mongoose, { Schema, models } from 'mongoose';

const AlbumSchema = new Schema({
  title: String,
  description: String,
  images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  accessUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isVisible: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
}, { timestamps: true });

export const Album = models.Album || mongoose.model('Album', AlbumSchema);
