import { connectDB } from '@/lib/db';
import { Image } from '@/models/Image';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ albumId: string }> }) {
    await connectDB();
    const { albumId } = await params;
    const images = await Image.find({ albumId, isVisible: true });
    return NextResponse.json(images);
}