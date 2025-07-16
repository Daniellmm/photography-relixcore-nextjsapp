import mongoose from "mongoose";

const SelectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
  selectedImageIds: [String], // store image ids
}, { timestamps: true });

export const Selection = mongoose.models.Selection || mongoose.model("Selection", SelectionSchema);
