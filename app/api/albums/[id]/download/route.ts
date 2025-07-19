import { connectDB } from '@/lib/db';
import { Album } from '@/models/Album';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { PassThrough } from 'stream';
import archiver from 'archiver';
import fetch from 'node-fetch';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const album = await Album.findById(context.params.id).populate('images');
  if (!album) {
    return new Response(JSON.stringify({ error: 'Album not found' }), { status: 404 });
  }

  const userId = session.user._id;
  const hasAccess = album.owner?.toString() === userId ||
    album.accessUsers?.map((id: any) => id.toString()).includes(userId);

  if (!hasAccess) {
    return new Response(JSON.stringify({ error: 'You do not have permission to access this album' }), { status: 403 });
  }

  const zipStream = new PassThrough();
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(zipStream);

  for (const image of album.images) {
    // If album is paid, send original. If not, send watermark or skip
    const imageUrl = album.paid ? image.url : image.watermarkUrl;

    if (!imageUrl) continue;

    try {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) continue;

      const arrayBuffer = await imgRes.arrayBuffer();
      archive.append(Buffer.from(arrayBuffer), { name: `${image._id}.jpg` });
    } catch (err) {
      console.error(`Failed to fetch image ${image._id}:`, err);
    }
  }

  archive.finalize();

  return new Response(zipStream as any, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${album.title.replace(/\s+/g, '_')}.zip"`,
    },
  });
}
