import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";

import hero1 from "../assets/hero1.webp";
import hero2 from "../assets/hero2.webp";
import hero3 from "../assets/hero3.webp";
import hero4 from "../assets/hero4.webp";
// import hero5 from "../assets/hero5.webp";

const slides = [
  { image: hero1 },
  { image: hero2 },
  { image: hero3 },
  { image: hero4 },
  // { image: hero5 },
];

const Hero = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (!t?.hero?.slides) return null;

  const activeSlide = slides[currentSlide];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105"
        style={{ backgroundImage: `url(${activeSlide.image})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">

            {/* Accent Line */}
            <div className="w-16 h-1 bg-amber-500 rounded-full mb-6" />

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t.hero.slides[currentSlide]?.title}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              {t.hero.slides[currentSlide]?.description}
            </p>

            {/* CTA Button */}
            <a
              href="https://wa.me/971528686112"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base transition-all duration-300 hover:scale-105"
            >
              {t.hero.slides[currentSlide]?.cta}
            </a>

            {/* Mobile Arrows - Shown below button on mobile only */}
            <div className="flex lg:hidden items-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-all text-3xl leading-none"
              >
                &lsaquo;
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-all text-3xl leading-none"
              >
                &rsaquo;
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Desktop Arrow - Left */}
      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/10 backdrop-blur items-center justify-center text-white hover:bg-white/20 transition-all text-4xl leading-none"
      >
        &lsaquo;
      </button>

      {/* Desktop Arrow - Right */}
      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/10 backdrop-blur items-center justify-center text-white hover:bg-white/20 transition-all text-4xl leading-none"
      >
        &rsaquo;
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-10 bg-amber-500" : "w-4 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;