'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Image as ImageIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface Album {
  _id: string;
  name: string;
  eventDate: string;
  thumbnailUrl: string;
  isPaid: boolean;
  photoCount: number;
  eventType: string;
}

interface AlbumFromAPI {
  _id: string;
  title: string;
  eventDate: string;
  eventType: string;
  paid: boolean;
  images?: { url: string }[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function AdminDashboard() {
  const [albums, setAlbums] = useState<Album[]>([]);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/admin/albums');
      const data: AlbumFromAPI[] = await res.json();

      const mappedAlbums: Album[] = data.map((album) => ({
        _id: album._id,
        name: album.title,
        eventDate: album.eventDate,
        eventType: album.eventType,
        isPaid: album.paid,
        thumbnailUrl: album.images?.[0]?.url || '/placeholder.jpg',
        photoCount: album.images?.length || 0,
      }));

      setAlbums(mappedAlbums);
    } catch (err) {
      console.error("Failed to fetch albums", err);
      toast.error("Failed to fetch albums");
    }
  };

  const handleDelete = async (albumId: string) => {
    try {
      const res = await fetch('/api/admin/albums', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ albumId }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || 'Failed to delete album');
        return;
      }

      toast.success('Album deleted');
      setAlbums((prev) => prev.filter((a) => a._id !== albumId));
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Failed to delete album");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="min-h-screen bg-gallery-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            {albums.length} total album{albums.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card key={album._id} className="overflow-hidden hover:shadow-lg py-0 gap-0 transition-shadow duration-300">
              <Link href={`/admin/albums/admin/${album._id}`}>
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
                  <div>
                    <h3 className="text-lg font-medium text-black line-clamp-2">{album.name}</h3>
                    <Badge variant="outline" className="mt-2 text-black/40 border-black/40">
                      {album.eventType}
                    </Badge>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{formatDate(album.eventDate)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDelete(album._id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Album
                </Button>
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
