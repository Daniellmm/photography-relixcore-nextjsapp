// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db';
// import { Album } from '@/models/Album';

// export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     await connectDB();
//     const { id } = await params;
//     const album = await Album.findById(id).populate("images");

//     if (!album) {
//         return NextResponse.json({ error: "Album not found" }, { status: 404 });
//     }

//     return NextResponse.json({ images: album.images });
// }



// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db';
// import { Album } from '@/models/Album';

// export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     try {
//         await connectDB();
//         const { id } = await params;

//         const album = await Album.findById(id).populate("images");

//         if (!album) {
//             return NextResponse.json({ error: "Album not found" }, { status: 404 });
//         }

//         // Transform the album data to match your frontend expectations
//         const albumData = {
//             id: album._id.toString(),
//             title: album.title,
//             description: album.description,
//             eventDate: album.eventDate,
//             eventType: album.eventType,
//             userId: album.userId,
//             owner: album.owner,
//             accessUsers: album.accessUsers,
//             isVisible: album.isVisible,
//             paid: album.paid,
//             totalImages: album.images?.length || 0,
//             images: album.images || [],
//             createdAt: album.createdAt,
//             updatedAt: album.updatedAt
//         };

//         return NextResponse.json({ album: albumData });
//     } catch (error) {
//         console.error('Error fetching album:', error);
//         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//     }
// }


import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Album } from '@/models/Album';
import mongoose from 'mongoose';
import { IImage } from '@/models/Image';
import  '@/models/Image';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {
        await connectDB();

        // Await the params promise
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid album ID" }, { status: 400 });
        }

        const album = await Album.findById(id).populate({
            path: 'images',
            model: 'Image',
        });

        if (!album) {
            return NextResponse.json({ error: "Album not found" }, { status: 404 });
        }

        const albumData = {
            id: album._id.toString(),
            title: album.title,
            description: album.description,
            eventDate: album.eventDate?.toISOString() || null,
            eventType: album.eventType,
            isVisible: album.isVisible,
            paid: album.paid,
            totalImages: album.images?.length || 0,
            images: (album.images || []).map((img: IImage) => ({
                _id: img._id.toString(),
                url: img.url,
                public_id: img.public_id,
                watermarkUrl: img.watermarkUrl,
                visible: img.visible,
            })),
        };

        return NextResponse.json({ album: albumData });
    } catch (error: unknown) {
        let errorMessage = "Internal server error";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Error fetching album:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}