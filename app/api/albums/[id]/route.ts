import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Album } from "@/models/Album";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    await connectDB();

    const album = await Album.findById(params.id).populate("images"); 
    if (!album) {
        return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    return NextResponse.json({ images: album.images });
}
