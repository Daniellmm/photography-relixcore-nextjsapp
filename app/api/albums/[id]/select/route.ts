// app/api/albums/[id]/select/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Selection } from "@/models/Selection";
import { connectDB } from "@/lib/db";
import { Types } from 'mongoose';


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: albumId } = await params;
  const body = await req.json();
  const { selectedImageIds } = body;

  if (!Array.isArray(selectedImageIds)) {
    return NextResponse.json({ error: "Invalid image list" }, { status: 400 });
  }

  await connectDB();

  // Either update or create the selection
  const updated = await Selection.findOneAndUpdate(
    { userId: session.user._id, albumId },
    { $set: { selectedImageIds } },
    { upsert: true, new: true }
  );

  return NextResponse.json({ message: "Selection saved", selection: updated });
}


// Add to your types file or at the top of the route file
interface UserRef {
  _id: string;
  name: string;
  email: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const { id: albumId } = await params;

  // Type the selection explicitly
  const selection = await Selection.findOne({
    albumId,
    userId: session.user._id,
  }).lean<{ selectedImageIds: string[] } | null>();

  if (!selection) {
    return NextResponse.json({ selectedImageIds: [] });
  }

  return NextResponse.json({ selectedImageIds: selection.selectedImageIds });
}
