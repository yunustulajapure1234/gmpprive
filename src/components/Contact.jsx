import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const SocialIcons = {
  Facebook: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  ),
  WhatsApp: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
};

const Contact = () => {
  const { t } = useLanguage();
  if (!t || !t.contact) return null;

  const contactCards = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: t.contact.address,
      value: t.contact.addressText,
      href: "https://maps.google.com/?q=Irise+Tower+Barsha+Heights+Dubai",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      border: "border-amber-100 hover:border-amber-300",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: t.contact.call,
      value: "+971 52 868 6112",
      href: "tel:+971528686112",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      border: "border-emerald-100 hover:border-emerald-300",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: t.contact.email,
      value: "book@gmpprive.com",
      href: "mailto:book@gmpprive.com",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      border: "border-blue-100 hover:border-blue-300",
    },
    {
      icon: SocialIcons.WhatsApp,
      label: t.contact.whatsapp || "WhatsApp",
      value: "+971 52 868 6112",
      href: "https://wa.me/971528686112",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      border: "border-green-100 hover:border-green-300",
    },
  ];

  const socials = [
    { name: "Facebook",  icon: SocialIcons.Facebook,  url: "https://www.facebook.com/people/GMP-SALON-and-SPA/61583204853719/", bg: "hover:bg-blue-500 hover:text-white hover:border-blue-500" },
    { name: "Instagram", icon: SocialIcons.Instagram, url: "https://www.instagram.com/gmp_prive_dubai",                        bg: "hover:bg-pink-500 hover:text-white hover:border-pink-500" },
    { name: "YouTube",   icon: SocialIcons.YouTube,   url: "https://www.youtube.com/@GMP_Prive_Beauty_and_Fitness",             bg: "hover:bg-red-500 hover:text-white hover:border-red-500" },
    { name: "TikTok",    icon: SocialIcons.TikTok,    url: "https://www.tiktok.com/",                                          bg: "hover:bg-gray-900 hover:text-white hover:border-gray-900" },
  ];

  return (
    <section
      id="contact"
      className="relative py-14 overflow-hidden"
      style={{ background: " bg-gradient-to-br from-[#fffbf0] via-white to-[#fff7ed]" }}
    >
      {/* Soft decorative blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-100/60 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/80 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-16">
      
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>

          <p className="text-gray-500 text-lg max-w-md mx-auto">
            {t.contact.description}
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid lg:grid-cols-5 gap-7 items-start">

          {/* Left — Contact cards + socials */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {contactCards.map((card, i) => (
              <a
                key={i}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 p-4 rounded-2xl bg-white border ${card.border} shadow-sm hover:shadow-md transition-all duration-250`}
              >
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                  {card.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                    {card.label}
                  </p>
                  <p className="text-gray-800 font-semibold text-sm leading-snug whitespace-pre-line">
                    {card.value}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}

            {/* Social row */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium mr-1">
                Follow
              </span>
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className={`w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 transition-all duration-200 hover:scale-110 ${s.bg}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/971528686112"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl  bg-gradient-to-br from-amber-400 to-yellow-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all duration-250 hover:scale-[1.02]"
            >
              {SocialIcons.WhatsApp}
              Book via WhatsApp
            </a>
          </div>

          {/* Right — Map */}
          <div className="lg:col-span-3">
            <div
              className="rounded-3xl overflow-hidden border border-gray-100 shadow-xl"
              style={{ height: 490 }}
            >
              {/* Map top bar */}
              <div className="flex items-center gap-2.5 px-4 py-3 bg-white border-b border-gray-100">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-gray-700 text-sm font-medium flex-1">
                  GMP Prive — Irise Tower, Barsha Heights, Dubai
                </span>
                <a
                  href="https://maps.google.com/?q=Irise+Tower+Barsha+Heights+Dubai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors"
                >
                  Open in Maps
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <iframe
                src="https://www.google.com/maps?q=Irise+Tower+Al+Thanyah+First+Barsha+Heights+Dubai+UAE&output=embed"
                className="w-full"
                style={{ height: "calc(100% - 48px)", border: 0 }}
                loading="lazy"
                allowFullScreen
                title="GMP Privé Location"
              />
            </div>

            {/* Address strip */}
            <div className="flex items-center gap-3 mt-3 px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-500 text-sm flex-1">
                Irise Tower · Al Thanyah First · Barsha Heights · Dubai, UAE
              </p>
              <a
                href="tel:+971528686112"
                className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors flex-shrink-0"
              >
                +971 52 868 6112
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;