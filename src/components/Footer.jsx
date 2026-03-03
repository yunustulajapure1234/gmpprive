import React, { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/GMP-Prive-Beauty-and-fitness (2) (1).png";
import "./Footer.css";

const Footer = () => {
  const { t }     = useLanguage();
  const navigate  = useNavigate();
  const location  = useLocation();
  const footerRef = useRef(null);

  /* ── Same routing logic as Navbar ── */
  const goToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ── Scroll-in animation ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footerRef.current?.classList.add("footer-visible");
        }
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const quickLinks = [
    { label: t.footer?.links?.home     || "Home",     action: () => navigate("/")           },
    { label: t.footer?.links?.services || "Services", action: () => goToSection("services") },
    { label: t.footer?.links?.packages || "Packages", action: () => goToSection("packages") },
    { label: t.footer?.links?.about    || "About",    action: () => goToSection("about")    },
    { label: t.footer?.links?.faqs     || "Policy",   action: () => goToSection("policy")   },
  ];

  return (
    <footer ref={footerRef} className="footer-root" id="contact">

      {/* Gold top border */}
      <div className="footer-top-line" />

      {/* Ambient orbs */}
      <div className="footer-orb footer-orb-1" />
      <div className="footer-orb footer-orb-2" />

      <div className="footer-inner">

        {/* ── Grid: Brand / Links / Contact ── */}
        <div className="footer-grid">

          {/* BRAND */}
          <div className="footer-brand footer-col">
            <button onClick={() => navigate("/")} className="footer-logo-btn">
              <img src={logo} alt="GMP Privé" className="footer-logo" />
            </button>

            <p className="footer-tagline">
              {t.footer?.brandTag || "Luxury Home Salon • Dubai"}
            </p>

            <p className="footer-desc">
              {t.footer?.description || "Premium beauty & wellness services delivered to your home across Dubai."}
            </p>

          </div>

          {/* QUICK LINKS */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              <span className="footer-title-line" />
              {t.footer?.quickLinks || "Quick Links"}
            </h4>

            <ul className="footer-links-list">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <button onClick={link.action} className="footer-link">
                    <span className="footer-link-arrow">›</span>
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <Link to="/terms" className="footer-link">
                  <span className="footer-link-arrow">›</span>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              <span className="footer-title-line" />
              {t.footer?.contact || "Contact Us"}
            </h4>

            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <span className="contact-icon">📍</span>
                <span>Al Barsha Heights, Dubai, UAE</span>
              </li>
              <li className="footer-contact-item">
                <span className="contact-icon">📞</span>
                <a href="tel:+971528686112" className="footer-link">+971 52 868 6112</a>
              </li>
              <li className="footer-contact-item">
                <span className="contact-icon">✉️</span>
                <a href="mailto:book@gmpprive.com" className="footer-link footer-email">
                  book@gmpprive.com
                </a>
              </li>
            </ul>

            {/* <button onClick={() => goToSection("services")} className="footer-cta">
              Book Appointment
              <span className="footer-cta-arrow">→</span>
            </button> */}
          </div>
        </div>

        {/* ── Ornament divider ── */}
        <div className="footer-divider">
          <div className="footer-divider-ornament">
            <span className="ornament-dot" />
            <span className="ornament-line" />
            <span className="ornament-diamond">◆</span>
            <span className="ornament-line" />
            <span className="ornament-dot" />
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 <span className="footer-brand-name">GMP Prive</span> Beauty And Fitness
            {" — "}{t.footer?.rights || "All rights reserved"}
          </p>
          <p className="footer-made">
            Crafted with <span className="heart">♥</span> in Dubai
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;