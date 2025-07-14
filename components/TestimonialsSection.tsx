"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
    {
        name: "Sarah & Michael",
        type: "Wedding Clients",
        content: "Absolutely stunning photography! They captured every precious moment of our wedding day with such artistry and emotion. The photos tell our love story beautifully.",
        rating: 5
    },
    {
        name: "Jennifer Walsh",
        type: "Corporate Portrait",
        content: "Professional, punctual, and incredibly talented. The headshots exceeded my expectations and have been perfect for my business needs.",
        rating: 5
    },
    {
        name: "David Chen",
        type: "Event Photography",
        content: "They made our corporate event photography seamless. Great at capturing candid moments and the energy of the evening. Highly recommend!",
        rating: 5
    }
];


export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };


    return (
        <section className="py-20 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
                    <p className="text-muted-foreground text-lg">
                        What our clients say about their experience working with us
                    </p>
                </div>

                <div className="relative">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-8 md:p-12 text-center">
                            <div className="flex justify-center mb-4">
                                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                                ))}
                            </div>

                            <blockquote className="text-lg md:text-xl mb-6 leading-relaxed">
                                "{testimonials[currentIndex].content}"
                            </blockquote>

                            <div>
                                <p className="font-semibold text-lg">{testimonials[currentIndex].name}</p>
                                <p className="text-muted-foreground">{testimonials[currentIndex].type}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center mt-8 space-x-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-primary' : 'bg-muted'
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}