'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, Download, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";



interface Image {
    id: string;
    url: string;
    alt: string;
}

// interface FetchedImage {
//     _id: string;
//     url: string;
//     alt?: string;
// }


export default function AlbumViewer() {
    const params = useParams();
    const albumId = params.id as string;
    const router = useRouter();

    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
    const [viewingImageIndex, setViewingImageIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!albumId) return;

        const fetchAlbumImages = async () => {
            try {

                const res = await fetch(`/api/albums/${albumId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch album');
                }

                const data = await res.json();

                // Make sure we're accessing the correct property from the response
                const albumImages = data.album?.images || data.images || [];

                const formatted = albumImages.map((img: { _id: string; url: string; alt?: string }, i: number) => ({
                    id: img._id?.toString() || String(i),
                    url: img.url,
                    alt: img.alt || `Image ${i + 1}`,
                }));

                setImages(formatted);
            } catch (error) {
                console.error('Error fetching album:', error);
                toast.error("Failed to load album", {
                    description: error instanceof Error ? error.message : "Please try again later."
                });
            }
        };

        fetchAlbumImages();
    }, [albumId]);

    const toggleImageSelection = (imageId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        const newSelected = new Set(selectedImages);
        if (newSelected.has(imageId)) newSelected.delete(imageId);
        else newSelected.add(imageId);
        setSelectedImages(newSelected);
    };

    const openImageViewer = (index: number) => setViewingImageIndex(index);
    const closeImageViewer = () => setViewingImageIndex(null);

    const navigateImage = (dir: 'prev' | 'next') => {
        if (viewingImageIndex === null) return;
        if (dir === 'prev' && viewingImageIndex > 0) setViewingImageIndex(viewingImageIndex - 1);
        else if (dir === 'next' && viewingImageIndex < images.length - 1) setViewingImageIndex(viewingImageIndex + 1);
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/albums/${albumId}/select`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedImageIds: Array.from(selectedImages) }),
            });

            if (res.ok) {
                toast("Saved!", { description: "Your selected images were saved successfully." });
            } else {
                throw new Error("Failed to save");
            }
        } catch {
            toast("Error", { description: "Something went wrong saving your selections." });
        }
    };


    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                setLoading(true);

                const albumRes = await fetch(`/api/albums/${albumId}/select`);
                if (!albumRes.ok) {
                    const errorData = await albumRes.json();
                    throw new Error(errorData.error || 'Failed to fetch album');
                }

                const selectionData = await albumRes.json();
                const selected = selectionData.selectedImageIds || [];
                setSelectedImages(new Set(selected));

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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="h-72 md:w-60">
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


    return (
        <div className="h-screen">

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

            <div className="container mx-auto px-4 py-8 pb-24">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {images.map((image, index) => {
                        const isSelected = selectedImages.has(image.id);
                        return (
                            <Card
                                key={image.id}
                                onClick={() => openImageViewer(index)}
                                className={`relative overflow-hidden py-0 cursor-pointer hover:scale-105 transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}
                            >
                                <div className="aspect-square relative">
                                    <Image width={300} height={300} src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                                    <button
                                        onClick={(e) => toggleImageSelection(image.id, e)}
                                        className={`absolute top-2 right-2 p-1.5 rounded-full ${isSelected ? "bg-primary text-white" : "bg-white text-black"}`}
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {selectedImages.size > 0 && (
                <div className="fixed bottom-5 md:right-20 right-5 w-[90%]  md:w-[70%] rounded-md bg-background/90 backdrop-blur-md border-t px-4 py-4">
                    <div className="max-w-7xl mx-auto flex  justify-between items-center">
                        <Badge variant="secondary">{selectedImages.size} selected</Badge>
                        <Button onClick={handleSave}>
                            <Download className="mr-2 h-4 w-4" />
                            Save Selected
                        </Button>
                    </div>
                </div>
            )}

            {/* Viewer */}
            <Dialog open={viewingImageIndex !== null} onOpenChange={closeImageViewer}>
                <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black">
                    {viewingImageIndex !== null && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* <Button onClick={closeImageViewer} variant="ghost" size="icon" className="absolute top-4 right-4 text-white">
                                <X className="h-6 w-6" />
                            </Button> */}

                            {viewingImageIndex > 0 && (
                                <Button onClick={() => navigateImage('prev')} variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                                    <ChevronLeft className="h-8 w-8" />
                                </Button>
                            )}

                            {viewingImageIndex < images.length - 1 && (
                                <Button onClick={() => navigateImage('next')} variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 text-white">
                                    <ChevronRight className="h-8 w-8" />
                                </Button>
                            )}

                            <Image
                                height={1100}
                                width={800}
                                src={images[viewingImageIndex].url}
                                alt={images[viewingImageIndex].alt}
                                className="max-w-full max-h-full object-contain"
                            />

                            <Button
                                onClick={(e) => toggleImageSelection(images[viewingImageIndex].id, e)}
                                className="absolute bottom-4 right-4"
                            >
                                <Check className="h-4 w-4" />
                                {selectedImages.has(images[viewingImageIndex].id) ? 'Selected' : 'Select'}
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
