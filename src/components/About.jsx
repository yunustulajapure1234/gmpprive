import React from "react";
import { useLanguage } from "../context/LanguageContext";

import img1 from "../assets/massage-in-dubai.webp";
import img2 from "../assets/beauty-in-dubai.webp";
import img3 from "../assets/men-grooming-in-uae.webp";

const About = () => {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-br from-amber-50 via-white to-yellow-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ===== 3 IMAGE LAYOUT ===== */}
          <div className="relative h-[500px]">

            {/* Decorative corner lines */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-amber-400/60 rounded-tl-2xl z-0" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-amber-400/60 rounded-br-2xl z-0" />

            {/* Image 1 — Large, left side, full height */}
            <div className="absolute left-0 top-4 bottom-4 w-[56%] rounded-3xl overflow-hidden shadow-2xl z-10">
              <img
                src={img1}
                alt="GMP Prive Salon Dubai"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Image 2 — Top Right */}
            <div className="absolute right-0 top-4 w-[40%] h-[47%] rounded-3xl overflow-hidden shadow-2xl z-10">
              <img
                src={img2}
                alt="GMP Prive Beauty Dubai"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Image 3 — Bottom Right */}
            <div className="absolute right-0 bottom-4 w-[40%] h-[47%] rounded-3xl overflow-hidden shadow-2xl z-10">
              <img
                src={img3}
                alt="GMP Prive Spa Dubai"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating badge — between right two images */}
            <div className="absolute right-[38%] top-1/2 -translate-y-1/2 z-20 bg-white rounded-2xl shadow-2xl p-3 flex flex-col items-center border border-amber-100 w-16">
              <span className="text-amber-500 text-sm font-bold">4.9</span>
              <span className="text-yellow-500 text-xs">★★★★★</span>
              <span className="text-gray-400 text-[9px] mt-0.5 text-center leading-tight">Google Reviews</span>
            </div>

          </div>

          {/* ===== CONTENT SECTION ===== */}
          <div className="space-y-6">

            {/* Tag */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 rounded-full">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-amber-700 font-semibold text-sm tracking-wider uppercase">
                {t.about.tag}
              </span>
            </div>

            {/* Title */}
             <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent leading-tight"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t.about.title}
            </h2>

            {/* Gold divider */}
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full" />

            {/* Paragraphs */}
            <div className="space-y-4 text-gray-600 leading-relaxed text-base">
              {t.about.paragraphs.map((para, index) => (
                <p
                  key={index}
                  className={
                    index === t.about.paragraphs.length - 1
                      ? "font-semibold text-gray-900"
                      : ""
                  }
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { num: "5K+", label: "Happy Clients" },
                { num: "50+", label: "Services" },
                { num: "4.9★", label: "Google Rating" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-3 bg-white rounded-2xl shadow-sm border border-amber-100"
                >
                  <div className="text-2xl font-bold text-amber-600">{stat.num}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Punch Line */}
            {t.about.subtitle && (
              <div className="p-6 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl text-white shadow-xl">
                <p className="text-xl font-bold">{t.about.subtitle}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;