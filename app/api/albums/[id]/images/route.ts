// /app/api/albums/[id]/images/route.ts

import { connectDB } from "@/lib/db";
import { Album } from "@/models/Album";
import { Image } from "@/models/Image";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { imageIds } = await req.json();

    if (!params.id || !Array.isArray(imageIds)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Delete images from DB
    await Image.deleteMany({ _id: { $in: imageIds } });

    // Optionally, remove them from the album's image array too
    await Album.findByIdAndUpdate(params.id, {
      $pull: { images: { $in: imageIds.map(id => new mongoose.Types.ObjectId(id)) } }
    });

    return NextResponse.json({ message: "Images deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
