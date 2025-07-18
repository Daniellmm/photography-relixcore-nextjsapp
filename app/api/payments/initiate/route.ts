import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Album } from '@/models/Album';
import { Paystack } from '@/lib/paystack';
import { Payment } from '@/models/Payment';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { albumId } = await req.json();
    await connectDB();

    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const amount = album.price || 10000; // fallback price in Naira (₦100.00)

    const paystackRes = await Paystack.initializeTransaction({
      email: session.user.email,
      amount: amount * 100, //  amount in kobo
      metadata: {
        userId: session.user._id,
        albumId,
      },
    });

    // Save pending payment
    await Payment.create({
      userId: session.user._id, 
      albumId,
      reference: paystackRes.data.reference,
      amount,
      status: 'pending',
    });

    return NextResponse.json(paystackRes.data); 
  } catch (err) {
    console.error('[PAYMENT_INITIATE_ERROR]', err);
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}
