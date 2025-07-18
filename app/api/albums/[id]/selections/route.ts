import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Selection } from "@/models/Selection";
import { connectDB } from "@/lib/db";
import { User } from '@/models/User';
import { Types } from 'mongoose';



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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse>  {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const { id } = await params;

  // Verify admin role
  const user = await User.findById(session.user._id);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const albumId = id;
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