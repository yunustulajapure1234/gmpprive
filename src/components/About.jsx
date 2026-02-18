import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import aboutVideo from '../assets/All-Servicess-in-Dubai-UAE.mp4';


const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Video Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl h-96 lg:h-[520px]">
             <video
  autoPlay
  muted
  loop
  playsInline
  className="w-full h-full object-cover"
>
  <source src={aboutVideo} type="video/mp4" />
</video>

              {/* Play overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 rounded-full">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-amber-700 font-semibold text-sm tracking-wider uppercase">
                {t.about.tag}
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {t.about.title}
            </h2>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              {t.about.paragraphs.map((para, index) => (
                <p key={index} className={index === t.about.paragraphs.length - 1 ? 'font-semibold text-gray-900' : ''}>
                  {para}
                </p>
              ))}
            </div>

            {/* Punch Line */}
            <div className="relative mt-8 p-6  bg-gradient-to-br from-amber-400 to-yellow-700 rounded-2xl text-white shadow-xl">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-amber-400 rounded-full"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-yellow-500 rounded-full"></div>
              <p className="text-lg mb-2">{t.about.subtitle.split('.')[0]}.</p>
              <p className="text-xl font-bold">{t.about.subtitle.split('.')[1]}.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-gray-600 mt-1">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  50+
                </div>
                <div className="text-sm text-gray-600 mt-1">Expert Staff</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  15+
                </div>
                <div className="text-sm text-gray-600 mt-1">Services</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
