// app/api/admin/albums/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Album } from '@/models/Album';
import { isValidObjectId } from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const albums = await Album.find().populate('images').lean();

    return NextResponse.json(albums);
  } catch (err) {
    console.error('[ADMIN_ALBUMS_GET_ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { albumId } = await req.json();

    if (!isValidObjectId(albumId)) {
      return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
    }

    const deleted = await Album.findByIdAndDelete(albumId);
    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    console.error('[ADMIN_ALBUMS_DELETE_ERROR]', err);
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 });
  }
}
