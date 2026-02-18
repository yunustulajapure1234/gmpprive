import React, { useEffect, useState } from "react";

const ScrollOfferPopup = () => {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (closed) return;

      if (window.scrollY > 300) {
        setShow(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [closed]);

  if (!show || closed) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center px-4 animate-fadeIn">

      <div className="relative bg-black rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] w-full max-w-md p-8 text-center animate-scaleIn">

        {/* Close Button */}
        <button
          onClick={() => setClosed(true)}
          className="absolute top-4 right-4 text-amber-400 hover:text-white text-xl font-bold"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent mb-2">
          Save Upto 35%
        </h2>

        <p className="text-white text-lg mb-6">
          Super Saver Packages
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">

          <a
            href="tel:+971528686112"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-bold hover:scale-105 transition-all duration-300"
          >
            Call
          </a>

       <button
  onClick={() => {
    const section = document.getElementById("packages");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setClosed(true); // popup close
  }}
  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-700 text-black font-bold hover:scale-105 transition-all duration-300"
>
  Book
</button>


        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.35s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes scaleIn {
          from { transform: scale(0.85); opacity: 0 }
          to { transform: scale(1); opacity: 1 }
        }
      `}</style>
    </div>
  );
};

export default ScrollOfferPopup;
