"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Camera } from "lucide-react";
import weddingSample from "../public/assets/wedding-sample.jpg";
import portraitSample from "../public/assets/portrait-sample.jpg";
import eventSample from "../public/assets/event-sample.jpg";
import Image from "next/image";



export default function CategoriesSection() {


    const categories = [
        {
            title: "Weddings",
            description: "Capturing your special day with elegance and emotion",
            icon: Heart,
            image: weddingSample
        },
        {
            title: "Portraits",
            description: "Professional headshots and personal portraits",
            icon: Camera,
            image: portraitSample
        },
        {
            title: "Events",
            description: "Corporate events and special celebrations",
            icon: Users,
            image: eventSample
        }
    ];


    return (
        <section className="py-20 px-4 bg-background">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Categories</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore our specialized photography services, each crafted with attention to detail and artistic vision
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <Card key={index} className="group hover:shadow-lg py-0 transition-all duration-300 border-0 shadow-md overflow-hidden">
                                <div className="relative h-64 overflow-hidden  ">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                                    <div className="absolute top-4 left-4">
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                                    <p className="text-muted-foreground">{category.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}