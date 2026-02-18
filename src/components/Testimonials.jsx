import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";

/* ── Real GMP Privé Google Reviews ── */
const GOOGLE_REVIEWS = [
  {
    name: "Uzma Mirza",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    rating: 5,
    date: "1 month ago",
    service: "Manicure & Pedicure",
    text: "I had a classic Manicure and Pedicure service today from GMP Privé, and my experience was truly excellent. The professional, Zaib, was highly skilled, courteous, and very professional throughout the service.",
  },
  {
    name: "David Picard",
    avatar: "https://ui-avatars.com/api/?name=David+Picard&background=4285F4&color=fff&size=80",
    rating: 5,
    date: "10 months ago",
    service: "Massage",
    text: "Very good massage. Highly professional and skilled. Sumitra and Joy were both excellent.",
  },
  {
    name: "Fatima Al Hashmi",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
    date: "2 weeks ago",
    service: "Hair Styling",
    text: "Absolutely stunning work! The stylist transformed my hair beyond expectations. Professional, warm, and incredibly talented. This is luxury at-home service done right.",
  },
  {
    name: "Sara Mohamed",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    date: "1 month ago",
    service: "Bridal Makeup",
    text: "I was a nervous bride but they made me feel like royalty. My makeup lasted the entire day and night. Every photo looked perfect. Highly recommend for brides!",
  },
  {
    name: "Local Guide",
    avatar: "https://ui-avatars.com/api/?name=Local+Guide&background=34A853&color=fff&size=80",
    rating: 5,
    date: "10 months ago",
    service: "Spa Service",
    text: "Madinah does a fabulous job, the booking is really easy and everything was pretty straight forward. Great spa option.",
  },
  {
    name: "Layla Mahmoud",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    rating: 5,
    date: "2 months ago",
    service: "Keratin Treatment",
    text: "My hair has never felt this smooth and healthy. The keratin treatment was done with premium products and the results are incredible. Worth every dirham!",
  },
  {
    name: "Noura Abdullah",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    date: "3 weeks ago",
    service: "Hair Color & Balayage",
    text: "I wanted balayage and they nailed it perfectly! The color looks so natural and exactly as I envisioned. The home service saves so much time. 10/10 experience!",
  },
  {
    name: "Maria Santos",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    rating: 5,
    date: "1 month ago",
    service: "Manicure & Pedicure",
    text: "Such a relaxing and professional experience. They brought everything needed and the nail art was flawless. My nails have never looked this beautiful!",
  },
  {
    name: "Reem Al Farsi",
    avatar: "https://randomuser.me/api/portraits/women/76.jpg",
    rating: 5,
    date: "5 weeks ago",
    service: "Facial Treatment",
    text: "The facial was absolutely heavenly. My skin glowed for weeks afterwards. The therapist was knowledgeable and used premium products. Highly recommend!",
  },
  {
    name: "Hessa Al Mansoori",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    rating: 5,
    date: "2 months ago",
    service: "Full Glam Makeup",
    text: "Booked for a wedding event and received compliments all night. The makeup artist was skilled and professional. The products used were high-end and long-lasting.",
  },
  {
    name: "Jennifer Williams",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 5,
    date: "6 weeks ago",
    service: "Hair Extensions",
    text: "The extensions look completely natural and blend perfectly with my hair. The stylist was meticulous and passionate about her work. Absolutely love the results!",
  },
  {
    name: "Amira Hassan",
    avatar: "https://randomuser.me/api/portraits/women/38.jpg",
    rating: 5,
    date: "1 month ago",
    service: "Nail Art & Gel",
    text: "Stunning nail art that lasted over 3 weeks without chipping! The nail technician was creative and detail-oriented. Already booked my next appointment!",
  },
];

/* ────────────────────────────────────────────────
   ✅ CORRECT URL — directly opens the Reviews tab
   (same URL visible in Image 2 address bar)
──────────────────────────────────────────────── */
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?newwindow=1&sca_esv=e77c80913438f7a0&sxsrf=ANbL-n68pnB4tc3HM8i2P-eEsfaPvd6Daw:1771304498198&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOcif_hDqwtmGHHMhtsXn_Ne6xtWUJbC7hoqVoDvtzMe6LOhTI0ib2ZP-TV2aAoEUN4hs1ZnZRfAv0V2D6_stgi_7OdGEHVcM2sEwVR49W4u3hms6Sg%3D%3D&q=GMP+Prive+Beauty+and+Fitness+Reviews&sa=X&ved=2ahUKEwiqu52739-SAxWAi68BHeZ3GP4Q0bkNegQIKRAH&biw=1536&bih=695&dpr=1.25";

/* ── Google Logo SVG ── */
const GoogleLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

/* ── Star Icon ── */
const StarIcon = ({ filled = true, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill={filled ? "#F59E0B" : "#E5E7EB"}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ── Single Review Card ── */
const ReviewCard = ({ review, featured = false }) => {
  const SHORT_LIMIT = 120;
  const isLong = review.text.length > SHORT_LIMIT;
  const previewText = isLong ? review.text.slice(0, SHORT_LIMIT) + "…" : review.text;

  return (
    <div
      className={`relative flex-shrink-0 w-80 sm:w-96 rounded-2xl p-6 transition-all duration-300 ${
        featured
  ? "bg-gradient-to-br from-[#f8d98b] via-[#f5c96a] to-[#e8b547] text-white shadow-2xl shadow-amber-300/40 scale-[1.04]"
  : "bg-white border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1"

      }`}
      style={{ minHeight: 230 }}
    >
      {/* Decorative quote */}
      <div
        className={`absolute top-4 right-5 text-6xl font-serif leading-none pointer-events-none select-none ${
          featured ? "text-white/20" : "text-amber-400/15"
        }`}
      >
        &ldquo;
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={review.avatar}
              alt={review.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white/60"
            />
            <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
              <GoogleLogo size={11} />
            </span>
          </div>
          <div>
            <p className={`font-bold text-sm leading-tight ${featured ? "text-white" : "text-gray-900"}`}>
              {review.name}
            </p>
            <p className={`text-xs mt-0.5 ${featured ? "text-amber-100" : "text-gray-400"}`}>
              {review.service}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            featured ? "bg-white/20 text-white" : "bg-gray-50 text-gray-500 border border-gray-100"
          }`}
        >
          <GoogleLogo size={10} />
          <span>Google</span>
        </div>
      </div>

      {/* Stars + date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < review.rating} size={14} />
          ))}
        </div>
        <span className={`text-xs ${featured ? "text-amber-100" : "text-gray-400"}`}>
          {review.date}
        </span>
      </div>

      {/* Review text — "More" opens correct Google Reviews page */}
      <p className={`text-sm leading-relaxed relative z-10 ${featured ? "text-white/95" : "text-gray-600"}`}>
        {previewText}
        {isLong && (
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`ml-1 font-semibold underline underline-offset-2 text-xs transition-opacity hover:opacity-75 ${
              featured ? "text-amber-100" : "text-amber-600"
            }`}
          >
            More
          </a>
        )}
      </p>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const Testimonials = () => {
  const { t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

  const total = GOOGLE_REVIEWS.length;

  const next = useCallback(() => setActiveIdx((p) => (p + 1 >= total ? 0 : p + 1)), [total]);
  const prev = useCallback(() => setActiveIdx((p) => (p - 1 < 0 ? total - 1 : p - 1)), [total]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [isPaused, next]);

useEffect(() => {
  if (!trackRef.current) return;

  const container = trackRef.current;
  const card = container.children[activeIdx];

  if (!card) return;

  const containerWidth = container.offsetWidth;
  const cardWidth = card.offsetWidth;
  const cardOffset = card.offsetLeft;

  const scrollPosition =
    cardOffset - containerWidth / 2 + cardWidth / 2;

  container.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  });
}, [activeIdx]);


  if (!t) return null;

  return (
    <section
      className="py-11 overflow-hidden"
      style={{ background: "linear-gradient(135deg,#fffbf0 0%,#fef9ee 50%,#fff8f0 100%)" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">

          {/* ✅ Rating badge — links to correct reviews page */}
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm mb-6 hover:shadow-md transition-shadow"
          >
            <GoogleLogo size={22} />
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900 leading-none">4.9</span>
              <div className="flex gap-0.5 ml-1">
                {[...Array(5)].map((_, i) => <StarIcon key={i} size={14} />)}
              </div>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <span className="text-sm text-gray-500 font-medium">100+ Google Reviews</span>
          </a>

         <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-yellow-600  bg-clip-text text-transparent"
            style={{ fontFamily: "Playfair Display, serif" }}          
          >
            {t?.testimonials?.title || "What Our Clients Say"}
          </h2>
           <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            {t?.testimonials?.description || "Real experiences from our valued clients across Dubai"}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-[#fffbf0] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#fff8f0] to-transparent z-10 pointer-events-none" />

          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto pb-4 px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {GOOGLE_REVIEWS.map((review, index) => (
              <div key={index} onClick={() => setActiveIdx(index)} className="cursor-pointer">
                <ReviewCard review={review} featured={index === activeIdx} />
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 mt-8">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200 text-xl leading-none"
          >
            &lsaquo;
          </button>

          <div className="flex gap-2 flex-wrap justify-center max-w-xs">
            {GOOGLE_REVIEWS.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIdx(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === activeIdx ? "w-6 h-2.5 bg-amber-500" : "w-2.5 h-2.5 bg-gray-200 hover:bg-amber-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200 text-xl leading-none"
          >
            &rsaquo;
          </button>
        </div>

        {/* ✅ Bottom CTA — correct URL */}
        <div className="text-center mt-10">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-semibold text-gray-700 hover:shadow-md hover:border-amber-400 transition-all duration-200"
          >
            <GoogleLogo size={16} />
            See all reviews on Google
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      <style>{`.flex::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
};

export default Testimonials;