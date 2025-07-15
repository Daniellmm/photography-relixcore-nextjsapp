
import { connectDB } from '@/lib/db';
import { Image } from '@/models/Image';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { albumId: string } }) {
    await connectDB();
    const images = await Image.find({ albumId: params.albumId, isVisible: true });
    return NextResponse.json(images);
}
