"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const heroBg = "/assets/hero-bg.jpg"; // ✅ Correct path for public asset

export default function HeroSection() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    Capturing Moments,<br />
                    <span className="text-white/90">Telling Stories</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 text-white/80 max-w-2xl mx-auto">
                    Professional photography that transforms fleeting moments into timeless memories
                </p>
                <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 rounded-none font-medium"
                >
                    View Portfolio
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </section>
    );
}
