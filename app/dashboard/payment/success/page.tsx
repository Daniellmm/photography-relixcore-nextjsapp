// app/dashboard/payment/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) return;

      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          body: JSON.stringify({ reference }),
          headers: { 'Content-Type': 'application/json' },
        });

        await res.json();

        if (!res.ok) {
          toast.error('Payment verification failed');
          router.push('/dashboard');
          return;
        }

        toast.success('Payment verified successfully!');
        // Optionally redirect to album page
        router.push(`/dashboard`);
      } catch (err) {
        console.error(err);
        toast.error('Error verifying payment');
        router.push('/dashboard');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto text-muted-foreground" />
        {verifying && (
          <p className="mt-4 text-muted-foreground">Verifying your payment...</p>
        )}
      </div>
    </div>
  );
}
