"use client"

import weddingSample from "../public/assets/wedding-sample.jpg";
import portraitSample from "../public/assets/portrait-sample.jpg";
import eventSample from "../public/assets/event-sample.jpg";
import Image from "next/image";

const galleryImages = [
    { src: weddingSample, alt: "Wedding Photography" },
    { src: portraitSample, alt: "Portrait Photography" },
    { src: eventSample, alt: "Event Photography" },
    { src: weddingSample, alt: "Wedding Photography" },
    { src: portraitSample, alt: "Portrait Photography" },
    { src: eventSample, alt: "Event Photography" }
];

export default function GallerySection() {
    return (
        <section className="py-20 px-4 bg-muted/10">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Preview Gallery</h2>
                    <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
                        A glimpse into our portfolio showcasing the beauty and emotion captured in every frame
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden aspect-square hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className="border-2 border-primary px-8 py-3 font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                        View Full Portfolio
                    </button>
                </div>
            </div>
        </section>
    );
}