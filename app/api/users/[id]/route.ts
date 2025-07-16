// /app/api/users/[id]/route.ts
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';

type AlbumLean = {
  _id: Types.ObjectId;
  title: string;
  thumbnail?: string;
  isVisible: boolean;
  isPaid: boolean;
  eventDate: Date;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(id)
      .populate({
        path: 'albums',
        select: 'title thumbnail isVisible isPaid eventDate createdAt',
        options: { sort: { createdAt: -1 } }
      })
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formattedUser = {
      id: user._id.toString(),
      name: user.name || 'Unknown',
      email: user.email,
      role: user.role,
      createdDate: user.createdAt.toISOString(),
      albums: (user.albums as AlbumLean[]).map((album) => ({
        id: album._id.toString(),
        title: album.title,
        thumbnail: album.thumbnail || 'https://via.placeholder.com/400',
        isVisible: album.isVisible,
        isPaid: album.isPaid,
        eventDate: album.eventDate.toISOString(),
      })),
    };

    return NextResponse.json({ user: formattedUser });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}