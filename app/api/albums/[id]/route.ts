import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Album } from '@/models/Album';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    const album = await Album.findById(id).populate("images");
    
    if (!album) {
        return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }
    
    return NextResponse.json({ images: album.images });
}