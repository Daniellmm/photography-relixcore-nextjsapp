// /app/api/admin/users/[id]/route.ts
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



interface PopulatedAlbum {
  _id: any;
  title: string;
  thumbnail: string;
  isVisible: boolean;
  isPaid: boolean;
  eventDate: Date;
}

interface PopulatedUser {
  _id: any;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  albums: PopulatedAlbum[];
}


export async function GET(
  request: Request,
  contextPromise: Promise<{ params: { id: string } }>
) {
  const { params } = await contextPromise;
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }



    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectDB();

    const { Album } = await import('@/models/Album');

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
      albums: (user.albums as any[] || []).map((album) => ({
        id: album._id.toString(),
        title: album.title,
        thumbnail: album.thumbnail || 'https://via.placeholder.com/400',
        isVisible: album.isVisible,
        isPaid: album.isPaid,
        eventDate: new Date(album.eventDate).toISOString(),
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
