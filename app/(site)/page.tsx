'use client'

import CategoriesSection from "@/components/CategoriesSection";
import ContactSection from "@/components/ContactSection";
import GallerySection from "@/components/GallerySection";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
