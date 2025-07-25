'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, CreditCard, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface Album {
  _id: string;
  name: string;
  price: number;
  eventDate: string;
  thumbnailUrl: string;
  isPaid: boolean;
  photoCount: number;
  eventType: string;
}

interface AlbumFromAPI {
  _id: string;
  title: string;
  price: number;
  eventDate: string;
  eventType: string;
  paid: boolean;
  images?: { url: string;  watermarkUrl: string; }[];
}


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function Dashboard() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    fetch('/api/albums')
      .then((res) => res.json())
      .then((data: AlbumFromAPI[]) => {
        const formatted = data.map((album) => ({
          _id: album._id,
          name: album.title,
          price: album.price,
          eventDate: album.eventDate,
          eventType: album.eventType,
          isPaid: album.paid,
          photoCount: album.images?.length || 0,
          thumbnailUrl: album.paid
            ? album.images?.[0]?.url ?? '/placeholder.jpg'
            : album.images?.[0]?.watermarkUrl ?? '/placeholder.jpg',

        }));

        setAlbums(formatted);
      })
      .catch(() =>
        toast("Error", { description: "Failed to fetch albums" })
      );
  }, []);


  const handlePayment = async (albumId: string) => {
    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ albumId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      // Redirect to Paystack checkout URL
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);
      toast('Payment failed');
    }
  };


  const handleDownload = async (albumId: string) => {
    try {
      const res = await fetch(`/api/albums/${albumId}/download`);

      if (!res.ok) {
        throw new Error('Download failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `album_${albumId}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading album:', err);
      toast.error('Failed to download album');
    }
  };


  return (
    <div className="min-h-screen bg-gallery-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            {albums.length} album{albums.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card key={album._id} className="overflow-hidden hover:shadow-lg py-0 gap-0 transition-shadow duration-300">
              <Link href={`/dashboard/album/${album._id}`}>
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={album.thumbnailUrl}
                      height={600}
                      width={400}
                      alt={album.name}
                      className="w-full cursor-pointer h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={album.isPaid ? 'default' : 'destructive'}
                        className={album.isPaid ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {album.isPaid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-black/70 text-white border-none">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        {album.photoCount} photos
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Link>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className='flex justify-between items-end'>
                    <div>
                      <h3 className="text-lg font-medium text-black line-clamp-2">
                        {album.name}
                      </h3>
                      <Badge variant="outline" className="mt-2 text-black/40 border-black/401">
                        {album.eventType}
                      </Badge>
                    </div>

                    <div className='font-semibold'>
                      <h2>₦{album.price.toLocaleString()}</h2>
                    </div>
                  </div>


                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{formatDate(album.eventDate)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                {album.isPaid ? (
                  <Button onClick={() => handleDownload(album._id)} className="w-full" variant="default">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                ) : (
                  <Button onClick={() => handlePayment(album._id)} className="w-full text-white hover:border-black/50" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay to Download
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {albums.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No albums yet</h3>
            <p className="text-muted-foreground">
              Your photo albums will appear here once they are ready for download.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
