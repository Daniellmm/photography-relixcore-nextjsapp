// app/api/albums/[id]/select/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Selection } from "@/models/Selection";
import { connectDB } from "@/lib/db";
import { User } from '@/models/User';
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

interface SelectionDocument {
  _id: Types.ObjectId;
  userId: UserRef | Types.ObjectId;
  albumId: string | Types.ObjectId;
  selectedImageIds: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  // Verify admin role
  const user = await User.findById(session.user._id);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const albumId = params.id;
  const selections = await Selection.find({ albumId })
    .populate('userId', 'name email')
    .lean<SelectionDocument[]>();

  const responseSelections = selections.map(sel => ({
    id: sel._id.toString(),
    userId: {
      _id: (sel.userId as UserRef)._id.toString(),
      name: (sel.userId as UserRef).name,
      email: (sel.userId as UserRef).email
    },
    selectedImageIds: sel.selectedImageIds,
    createdAt: sel.createdAt.toISOString(),
    updatedAt: sel.updatedAt.toISOString()
  }));

  return NextResponse.json({ selections: responseSelections });
}