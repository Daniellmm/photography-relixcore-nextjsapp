// app/api/albums/[id]/select/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Selection } from "@/models/Selection";
import { connectDB } from "@/lib/db";

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