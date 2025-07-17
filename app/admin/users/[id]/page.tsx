// /app/admin/users/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Calendar, User, Eye, EyeOff, CreditCard, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

interface Album {
    id: string;
    title: string;
    thumbnail: string;
    isVisible: boolean;
    isPaid: boolean;
    eventDate: string;
}

interface UserDetail {
    id: string;
    name: string;
    email: string;
    role: string;
    createdDate: string;
    albums: Album[];
}

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/users/${userId}`, {
                    cache: 'no-store' // Ensure fresh data
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch user');
                }

                const data = await response.json();
                setUser(data.user);

            } catch (err) {
                console.error('Fetch error:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleAlbumClick = (albumId: string) => {
        // Navigate to album detail page
        router.push(`/admin/albums/${albumId}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-32 w-full rounded-md" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-4 w-16 mb-2" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert className="max-w-md mx-auto">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto p-6">
                <Alert className="max-w-md mx-auto">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>User not found</AlertDescription>
                </Alert>
            </div>
        );
    }

    const albums = Array.isArray(user.albums) ? user.albums : [];

    const stats = {
        totalAlbums: albums.length,
        visibleAlbums: albums.filter(album => album.isVisible).length,
        paidAlbums: albums.filter(album => album.isPaid).length,
        unpaidAlbums: albums.filter(album => !album.isPaid).length
    };


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
                <h1 className="text-3xl font-bold text-background">User Details</h1>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-background">{user.name}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-background break-all">{user.email}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">Role & Joined</p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                            {user.role}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                            {new Date(user.createdDate).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <p className="text-sm font-medium text-muted-foreground">Quick Stats</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Total Albums:</span>
                            <span className="font-medium">{stats.totalAlbums}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Visible:</span>
                            <span className="font-medium text-green-600">{stats.visibleAlbums}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Paid:</span>
                            <span className="font-medium text-blue-600">{stats.paidAlbums}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Albums Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-background">
                        Assigned Albums ({user.albums.length})
                    </h2>
                </div>

                {user.albums.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center h-32">
                            <p className="text-muted-foreground">No albums assigned to this user.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {user.albums.map((album) => (
                            <Card
                                key={album.id}
                                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-black/20"
                                onClick={() => handleAlbumClick(album.id)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="relative">
                                        <Image
                                            height={400}
                                            width={400}
                                            src={album.thumbnail}
                                            alt={album.title}
                                            className="w-full h-32 object-cover rounded-md bg-muted"
                                        />
                                        {!album.isVisible && (
                                            <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                                                <EyeOff className="h-8 w-8 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <CardTitle className="text-base text-background">
                                        {album.title}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(album.eventDate).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge
                                            variant={album.isVisible ? 'default' : 'secondary'}
                                            className="flex items-center gap-1"
                                        >
                                            {album.isVisible ? (
                                                <Eye className="h-3 w-3" />
                                            ) : (
                                                <EyeOff className="h-3 w-3" />
                                            )}
                                            {album.isVisible ? 'Visible' : 'Hidden'}
                                        </Badge>
                                        <Badge
                                            variant={album.isPaid ? 'default' : 'destructive'}
                                            className="flex items-center gap-1"
                                        >
                                            <CreditCard className="h-3 w-3" />
                                            {album.isPaid ? 'Paid' : 'Unpaid'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}