import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

import Hero from "../components/Hero";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import ComboPackages from "../components/ComboPackages";
import PolicyFAQ from "../components/PolicyFAQ";
import ScrollOfferPopup from "../components/ScrollOfferPopup";
const HomePage = ({ onBookNowClick }) => {
  const { language } = useLanguage();

  return (
    <>
    <ScrollOfferPopup />
      <Hero onBookNowClick={onBookNowClick} />
      <About />
    <ComboPackages/>
      {/* CATEGORY SELECTION */}
      <div className="py-10 md:py-8 "id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              {language === "ar" ? "اختر فئتك" : "Choose Your Category"}
            </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {language === "ar"
                ? "خدمات متخصصة للرجال والنساء"
                : "Specialized services for men and women"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">

            {/* WOMEN */}
            <Link
              to="/women"
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 h-80 md:h-96"
            >
              <img
                src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200"
                alt="Women Services"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/95 via-pink-700/60 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
                <span className="text-pink-200 text-sm font-semibold mb-2">
                  💄 {language === "ar" ? "خدمات متكاملة" : "Complete Services"}
                </span>

                <h3 className="text-3xl md:text-5xl font-bold mb-3">
                  {language === "ar" ? "للنساء" : "For Women"}
                </h3>

                <p className="text-white/90 mb-4">
                  {language === "ar"
                    ? "الشعر، التجميل، السبا، الأظافر والمزيد"
                    : "Hair, Beauty, Spa, Nails & More"}
                </p>

                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 rounded-full font-semibold w-fit group-hover:scale-110 transition">
                  {language === "ar" ? "عرض الخدمات" : "View Services"}
                  →
                </span>
              </div>
            </Link>

            {/* MEN */}
            <Link
              to="/men"
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 h-80 md:h-96"
            >
              <img
                src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200"
                alt="Men Services"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-gray-800/60 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
                <span className="text-gray-300 text-sm font-semibold mb-2">
                  ✂️ {language === "ar" ? "عناية كاملة" : "Complete Grooming"}
                </span>

                <h3 className="text-3xl md:text-5xl font-bold mb-3">
                  {language === "ar" ? "للرجال" : "For Men"}
                </h3>

                <p className="text-white/90 mb-4">
                  {language === "ar"
                    ? "العناية، قص الشعر، السبا والتدليك"
                    : "Grooming, Haircut, Spa & Massage"}
                </p>

                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold w-fit group-hover:scale-110 transition">
                  {language === "ar" ? "عرض الخدمات" : "View Services"}
                  →
                </span>
              </div>
            </Link>

          </div>
        </div>
      </div>

      <Testimonials />
      <Contact />
      <PolicyFAQ />
    </>
  );
};

export default HomePage;
