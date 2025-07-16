import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { ImageSelection } from '@/models/ImageSelection';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { albumId, selectedImages } = body;

  if (!albumId || !Array.isArray(selectedImages)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await connectDB();

  const existing = await ImageSelection.findOne({
    user: session.user._id,
    album: albumId,
  });

  let selection;

  if (existing) {
    existing.selectedImages = selectedImages;
    await existing.save();
    selection = existing;
  } else {
    selection = await ImageSelection.create({
      user: session.user._id,
      album: albumId,
      selectedImages,
    });
  }

  return NextResponse.json({ success: true, selection });
}


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const albumId = req.nextUrl.searchParams.get('albumId');
  if (!albumId) {
    return NextResponse.json({ error: 'albumId required' }, { status: 400 });
  }

  await connectDB();

  const selection = await ImageSelection.findOne({
    user: session.user._id,
    album: albumId,
  });

  return NextResponse.json({ success: true, selection });
}
