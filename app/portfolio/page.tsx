'use client'

import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import Image from 'next/image';
import Lightbox  from '../../components/Lightbox'
import { Button } from '@/components/ui/button';

interface ImageData {
    id: number;
    src: string;
    title: string;
    category: 'weddings' | 'events' | 'portraits';
}

const images: ImageData[] = [
    {
        id: 1,
        src: '/assets/wedding-sample.jpg',
        title: 'Sunset Wedding Ceremony',
        category: 'weddings'
    },
    {
        id: 2,
        src: '/assets/wedding-sample.jpg',
        title: 'Garden Wedding Processional',
        category: 'weddings'
    },
    {
        id: 3,
        src: '/assets/portrait-sample.jpg',
        title: 'Professional Portrait',
        category: 'portraits'
    },
    {
        id: 4,
        src: '/assets/portrait-sample.jpg',
        title: 'Corporate Headshot',
        category: 'portraits'
    },
    {
        id: 5,
        src: '/assets/event-sample.jpg',
        title: 'Corporate Networking Event',
        category: 'events'
    },
    {
        id: 6,
        src: '/assets/event-sample.jpg',
        title: 'Birthday Celebration',
        category: 'events'
    }
];

const categories = [
    { id: 'all', label: 'All' },
    { id: 'weddings', label: 'Weddings' },
    { id: 'events', label: 'Events' },
    { id: 'portraits', label: 'Portraits' }
];

export default function Portfolio() {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const filteredImages = useMemo(() => {
        if (activeCategory === 'all') {
            return images;
        }
        return images.filter(image => image.category === activeCategory);
    }, [activeCategory]);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const goToPrevious = () => {
        setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : filteredImages.length - 1
        );
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) =>
            prev < filteredImages.length - 1 ? prev + 1 : 0
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-light text-gray-900 mb-3">Portfolio Gallery</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Capturing life's most precious moments with artistic vision and professional excellence
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <Filter className="h-5 w-5 text-gray-500 mt-2 mr-4" />
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors min-w-24 ${
                                activeCategory === category.id
                                    ? 'bg-black text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImages.map((image, index) => (
                        <div
                            key={image.id}
                            className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            onClick={() => openLightbox(index)}
                        >
                            {/* Image */}
                            <Image
                                src={image.src}
                                alt={image.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-white text-6xl font-light opacity-20 transform -rotate-12 select-none">
                                    SAMPLE
                                </div>
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white font-medium text-lg mb-1">{image.title}</h3>
                                <p className="text-white/80 text-sm capitalize">{image.category}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredImages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No images found in this category.</p>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={closeLightbox}
                images={filteredImages}
                currentIndex={currentImageIndex}
                onPrevious={goToPrevious}
                onNext={goToNext}
            />
        </div>
    );
}