'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, CreditCard, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Album {
    id: number;
    name: string;
    eventDate: string;
    thumbnail: string;
    isPaid: boolean;
    photoCount: number;
    eventType: string;
}


const mockAlbums: Album[] = [
    {
        id: 1,
        name: "Sarah & Michael's Wedding",
        eventDate: "2024-06-15",
        thumbnail: '/assets/wedding-sample.jpg',
        isPaid: true,
        photoCount: 247,
        eventType: "Wedding"
    },
    {
        id: 2,
        name: "Emma's 5th Birthday Party",
        eventDate: "2024-05-22",
        thumbnail: '/assets/event-sample.jpg',
        isPaid: false,
        photoCount: 89,
        eventType: "Birthday"
    },
    {
        id: 3,
        name: "TechCorp Annual Conference",
        eventDate: "2024-04-10",
        thumbnail: '/assets/portrait-sample.jpg',
        isPaid: true,
        photoCount: 156,
        eventType: "Corporate Event"
    },
    {
        id: 4,
        name: "Anniversary Celebration",
        eventDate: "2024-03-18",
        thumbnail: '/assets/wedding-sample.jpg',
        isPaid: false,
        photoCount: 94,
        eventType: "Anniversary"
    }
];

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default function Dashboard() {
    const handlePayment = (albumId: number) => {
        // Handle payment logic here
        console.log(`Initiating payment for album ${albumId}`);
    };

    const handleDownload = (albumId: number) => {
        // Handle download logic here
        console.log(`Downloading album ${albumId}`);
    };

    return (
        <div className="min-h-screen bg-gallery-bg">
            {/* Albums Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <p className="text-muted-foreground">
                        {mockAlbums.length} album{mockAlbums.length !== 1 ? 's' : ''} available
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockAlbums.map((album) => (
                        <Card key={album.id} className="overflow-hidden hover:shadow-lg py-0 transition-shadow duration-300">
                            <CardHeader className="p-0">
                                <div className="relative aspect-square overflow-hidden">
                                    <Image
                                        src={album.thumbnail}
                                        height={400}
                                        width={400}
                                        alt={album.name}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <Badge
                                            variant={album.isPaid ? "default" : "destructive"}
                                            className={album.isPaid ? "bg-green-600 hover:bg-green-700" : ""}
                                        >
                                            {album.isPaid ? "Paid" : "Unpaid"}
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

                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-lg font-medium text-black line-clamp-2">
                                            {album.name}
                                        </h3>
                                        <Badge variant="outline" className="mt-2 text-black/40 border-black/401">
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
                                {album.isPaid ? (
                                    <Button
                                        onClick={() => handleDownload(album.id)}
                                        className="w-full"
                                        variant="default"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download All
                                    </Button>
                                ) : (
                                    <Button
                                        disabled
                                        onClick={() => handlePayment(album.id)}
                                        className="w-full text-white"
                                        variant="outline"
                                    >
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Pay to Download
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {mockAlbums.length === 0 && (
                    <div className="text-center py-12">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No albums yet</h3>
                        <p className="text-muted-foreground">
                            Your photo albums will appear here once they are ready for download.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}