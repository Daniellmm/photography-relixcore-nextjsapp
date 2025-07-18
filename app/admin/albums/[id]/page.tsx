// /app/admin/albums/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Eye, EyeOff, CreditCard, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

interface ImageSelection {
    id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    selectedImageIds: string[];
    createdAt: string;
    updatedAt: string;
}

interface Album {
    id: string;
    title: string;
    price: number;
    description?: string;
    eventDate: string;
    eventType: string;
    isVisible: boolean;
    paid: boolean;
    totalImages: number;
    images: Array<{
        _id: string;
        url: string;
        public_id: string;
        watermarkUrl: string;
        visible: boolean;
    }>;
}

interface AlbumDetailData {
    album: Album;
    imageSelections: ImageSelection[];
}

export default function AdminAlbumDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const userIdFromQuery = searchParams.get('user');
    const albumId = params.id as string;

    const [data, setData] = useState<AlbumDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(userIdFromQuery);


    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                setLoading(true);

                const [albumRes, selectionsRes] = await Promise.all([
                    fetch(`/api/albums/${albumId}`),
                    fetch(`/api/albums/${albumId}/select`)
                ]);

                if (!albumRes.ok) {
                    const errorData = await albumRes.json();
                    throw new Error(errorData.error || 'Failed to fetch album');
                }

                if (!selectionsRes.ok) {
                    const errorData = await selectionsRes.json();
                    throw new Error(errorData.error || 'Failed to fetch selections');
                }

                const { album: albumData } = await albumRes.json();
                const { selections } = await selectionsRes.json();

                setData({
                    album: albumData,
                    imageSelections: selections || []
                });
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumDetails();
    }, [albumId]);


    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert className="max-w-md mx-auto">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto p-6">
                <Alert className="max-w-md mx-auto">
                    <AlertDescription>Album not found</AlertDescription>
                </Alert>
            </div>
        );
    }

    const { album, imageSelections } = data;
    const selectedUserSelection = selectedUser
        ? imageSelections.find(s => s.userId._id === selectedUser)
        : null;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                    className="hover:border-black/50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold text-background">Album Details</h1>
            </div>

            {/* Album Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader className="pb-3">
                        {album.images.length > 0 && (
                            <Image
                                src={album.images[0].url}
                                alt={album.title}
                                width={300}
                                height={200}
                                className="w-full h-48 object-cover rounded-md"
                            />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className=' flex justify-between items-center'>
                            <h2 className="text-xl font-bold mb-2">{album.title}</h2>
                            <div className='font-semibold'>
                                <h2>₦{album.price}</h2>
                            </div>
                        </div>
                        {album.description && (
                            <p className="text-sm text-muted-foreground mb-2">{album.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground mb-2">
                            {album.eventType} • {new Date(album.eventDate).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant={album.isVisible ? 'default' : 'secondary'}>
                                {album.isVisible ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                                {album.isVisible ? 'Visible' : 'Hidden'}
                            </Badge>
                            <Badge variant={album.paid ? 'default' : 'destructive'}>
                                <CreditCard className="h-3 w-3 mr-1" />
                                {album.paid ? 'Paid' : 'Unpaid'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">Images</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{album.totalImages}</p>
                        <p className="text-sm text-muted-foreground">Total Images</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">Users</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{imageSelections.length}</p>
                        <p className="text-sm text-muted-foreground">Made Selections</p>
                    </CardContent>
                </Card>

                {/* <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">Activity</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Last updated: {imageSelections.length > 0
                                ? new Date(Math.max(...imageSelections.map(s => new Date(s.updatedAt).getTime()))).toLocaleDateString()
                                : 'No activity'
                            }
                        </p>
                    </CardContent>
                </Card> */}
            </div>

            {/* User Selections */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl text-background/70 font-bold">User Image Selections</h2>
                </div>

                {imageSelections.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center h-32">
                            <p className="text-muted-foreground">No users have made selections for this album yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Users List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Users ({imageSelections.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {imageSelections.map((selection) => (
                                        <div
                                            key={selection.id}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedUser === selection.userId._id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            onClick={() => setSelectedUser(selection.userId._id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{selection.userId.name}</p>
                                                    <p className="text-sm text-muted-foreground">{selection.userId.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">{selection.selectedImageIds.length} images</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(selection.updatedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Selected Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {selectedUserSelection
                                        ? `${selectedUserSelection.userId.name}'s Selections (${selectedUserSelection.selectedImageIds.length})`
                                        : 'Select a user to view their selections'
                                    }
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedUserSelection ? (
                                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                        {selectedUserSelection.selectedImageIds.map((imageId) => {
                                            const image = album.images.find(img => img._id === imageId);
                                            return image ? (
                                                <div key={imageId} className="relative">
                                                    <Image
                                                        src={image.watermarkUrl || image.url}
                                                        alt={`Selected image ${imageId}`}
                                                        width={200}
                                                        height={150}
                                                        className="w-full h-24 object-cover rounded-md"
                                                    />
                                                    {!image.visible && (
                                                        <div className="absolute top-1 right-1">
                                                            <EyeOff className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-32">
                                        <p className="text-muted-foreground">Click on a user to view their selected images</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}