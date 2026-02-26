import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import logo from "../assets/GMP-Prive-Beauty-and-fitness (2) (1).png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer
      className="bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-10"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-3 gap-14 mb-14">

          {/* BRAND */}
          <div>
            <div className="mb-6">
              <img
  src={logo}
  alt="GMP Prive"
  className="h-16 w-auto mb-4"
/>

              <p className="text-sm text-gray-400 mt-1">
                {t.footer.brandTag}
              </p>
            </div>

            <p className="text-gray-400 leading-relaxed mb-6">
              {t.footer.description}
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-amber-400">
              {t.footer.quickLinks}
            </h4>

            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="/" className="hover:text-amber-400 transition-all duration-300">
                  {t.footer.links.home}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-all duration-300">
                  {t.footer.links.services}
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-amber-400 transition-all duration-300">
                  {t.footer.links.packages}
                </a>
              </li>
              <li>
                <a href="#policy" className="hover:text-amber-400 transition-all duration-300">
                  {t.footer.links.faqs}
                </a>
              </li>
             <li>
  <Link 
    to="/terms" 
    className="hover:text-amber-400 transition-all duration-300"
  >
    Terms & Conditions
  </Link>
</li>
              
              <li>
                <a href="#about" className="hover:text-amber-400 transition-all duration-300">
                  {t.footer.links.about}
                </a>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-amber-400">
              {t.footer.contact}
            </h4>

            <ul className="space-y-4 text-gray-400">
              <li>Al Barsha Heights, Dubai, UAE</li>

              <li>
                <a
                  href="tel:+971528686112"
                  className="hover:text-amber-400 transition-colors"
                >
                  +971 52 868 6112
                </a>
              </li>

              <li>
                <a
                  href="mailto:book@gmpprive.com"
                  className="hover:text-amber-400 transition-colors break-all"
                >
                  book@gmpprive.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 GMP Prive Salon & Spa — {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
