import mongoose, { Schema, models } from 'mongoose';

const AlbumSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  eventDate: {
    type: Date,
  },
  eventType: {
    type: String,
    enum: ['Wedding', 'Birthday', 'Corporate', 'Graduation', 'Anniversary', 'Baby Shower', 'Other'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'Image'
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  accessUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVisible: {
    type: Boolean,
    default: false
  },
  paid: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

export const Album = models.Album || mongoose.model('Album', AlbumSchema);