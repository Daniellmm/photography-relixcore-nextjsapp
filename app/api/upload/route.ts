import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { connectDB } from '@/lib/db';
import { Image } from '@/models/Image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Readable } from 'stream';

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  url?: string;
  format?: string;
  created_at?: string;
};


async function streamUpload(buffer: Buffer, filename: string): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'relixcore',
        public_id: filename,
        transformation: [
          {
            overlay: {
              font_family: 'Arial',
              font_size: 90,
              text: 'RelixCore',
              color: 'white'
            },
            gravity: 'center',
            opacity: 50,
          },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as CloudinaryUploadResult);
      }
    );

    const readable = new Readable();
    readable._read = () => { };
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
}


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll('images') as File[];

  await connectDB();

  const uploadedImages = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult: CloudinaryUploadResult = await streamUpload(buffer, file.name);


    const newImage = await Image.create({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      watermarkUrl: uploadResult.secure_url,
      owner: session.user._id,
      visible: false,
    });

    uploadedImages.push(newImage);
  }

  return NextResponse.json({ success: true, images: uploadedImages, imageIds: uploadedImages.map(img => img._id) });
}
