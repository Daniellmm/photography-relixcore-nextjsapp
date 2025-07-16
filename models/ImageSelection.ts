import mongoose, { Schema, models, model } from 'mongoose';

const ImageSelectionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
  },
  selectedImages: [{
    type: String,
    required: true,
  }],
}, {
  timestamps: true,
});

export const ImageSelection = models.ImageSelection || model('ImageSelection', ImageSelectionSchema);
