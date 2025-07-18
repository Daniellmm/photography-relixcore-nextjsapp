// /app/api/payments/webhook/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Payment } from '@/models/Payment';
import { Album } from '@/models/Album';
import { connectDB } from '@/lib/db';

export async function POST(req: Request) {
  await connectDB();
  const rawBody = await req.text();
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const signature = crypto
    .createHmac('sha512', secret)
    .update(rawBody)
    .digest('hex');

  const paystackSignature = req.headers.get('x-paystack-signature');

  if (signature !== paystackSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'charge.success') {
    const { reference, metadata, amount, paid_at, channel } = event.data;
    const { albumId, userId } = metadata;

    // update payment
    await Payment.findOneAndUpdate(
      { reference },
      {
        status: 'success',
        amount: amount / 100,
        paidAt: paid_at,
        channel
      }
    );

    // mark album as paid for that user
    await Album.findByIdAndUpdate(albumId, {
      $addToSet: { accessUsers: userId },
      paid: true
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
