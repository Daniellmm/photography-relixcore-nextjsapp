import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Album } from '@/models/Album';

export async function POST(req: Request) {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');

    // Get session to get the actual userId
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📝 Parsing request body...');
    const body = await req.json();
    console.log('📦 Request body:', body);

    // Prepare album data with userId from session
    const albumData = {
      ...body,
      userId: session.user._id,
      owner: session.user._id, // Set owner to current user as well
    };

    console.log('🏗️ Creating album with data:', albumData);
    const newAlbum = await Album.create(albumData);
    console.log('✅ Album created:', newAlbum);

    return NextResponse.json({ success: true, album: newAlbum });
  } catch (error) {
    console.error('❌ Album creation failed:', error);
    
    // Type guard to safely handle error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', errorMessage);
    if (errorStack) {
      console.error('Error stack:', errorStack);
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Album creation failed',
      error: errorMessage 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('🔌 Connecting to database for GET...');
    await connectDB();

    const session = await getServerSession(authOptions);
    console.log('👤 Session:', session);

    if (!session || !session.user?._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const albums = await Album.find({ userId: session.user._id });
    return NextResponse.json(albums);
  } catch (error) {
    console.error('❌ GET albums failed:', error);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}