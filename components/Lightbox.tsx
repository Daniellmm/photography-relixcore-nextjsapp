'use client'

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image';

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    images: Array<{ src: string; title: string; category: string }>;
    currentIndex: number;
    onPrevious: () => void;
    onNext: () => void;
}

export default function Lightbox({
    isOpen,
    onClose,
    images,
    currentIndex,
    onPrevious,
    onNext,
}: LightboxProps) {
    const currentImage = images[currentIndex];
    if (!currentImage) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-screen-xl max-h-screen p-0 bg-lightbox-overlay/95 border-none">
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Close button */}
                    {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 hover:text-white"
                    >
                        <X className="h-6 w-6" />
                    </Button> */}

                    {/* Navigation buttons */}
                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                        </>
                    )}

                    {/* Image */}
                    <div className="relative w-full h-full p-8">
                        <Image
                            src={currentImage.src}
                            alt={currentImage.title}
                            height={600}
                            width={600}
                            className="object-cover"
                            sizes="100vw"
                        />

                        {/* Image info */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-white text-xl font-medium">{currentImage.title}</h3>
                            <p className="text-white/80 text-sm capitalize">{currentImage.category}</p>
                        </div>
                    </div>

                    {/* Image counter */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}