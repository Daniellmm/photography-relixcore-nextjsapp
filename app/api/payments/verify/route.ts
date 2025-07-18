// /app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Paystack } from '@/lib/paystack';
import { Album } from '@/models/Album';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reference } = await req.json();
    if (!reference) {
      return NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 });
    }

    const verification = await Paystack.verifyTransaction(reference);
    const data = verification.data;

    if (data.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
    }

    const { albumId, userId } = data.metadata || {};

    // Double-check user is the one who made the payment
    const user = await User.findOne({ email: session.user.email });
    if (!user || user._id.toString() !== userId) {
      return NextResponse.json({ error: 'User mismatch' }, { status: 403 });
    }

    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    album.paid = true;
    await album.save();

    return NextResponse.json({ success: true, albumId });
  } catch (error) {
    console.error('[PAYMENT_VERIFY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
