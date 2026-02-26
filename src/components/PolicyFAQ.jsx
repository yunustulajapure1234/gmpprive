import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

/* ── Accordion Item ── */
const AccordionItem = ({
  title,
  content,
  isOpen,
  onToggle,
  accentColor = false,
  isRTL = false,
}) => (
  <div className="border-b border-gray-200 last:border-b-0">
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between py-6 group ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <span
        className={`text-sm font-semibold tracking-widest uppercase transition-colors duration-200 ${
          isOpen
            ? accentColor
              ? "text-amber-600"
              : "text-gray-900"
            : "text-gray-600 group-hover:text-gray-900"
        }`}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {title}
      </span>

      <span
        className={`flex-shrink-0 ${
          isRTL ? "mr-4" : "ml-4"
        } w-7 h-7 flex items-center justify-center rounded-full border transition-all duration-300 ${
          isOpen
            ? "bg-amber-500 border-amber-500 text-white rotate-45"
            : "border-gray-300 text-gray-400 group-hover:border-amber-400 group-hover:text-amber-500"
        }`}
      >
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </span>
    </button>

    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        maxHeight: isOpen ? "500px" : "0px",
        opacity: isOpen ? 1 : 0,
      }}
    >
      <p
        className={`pb-6 text-sm text-gray-600 leading-relaxed ${
          isRTL ? "pl-8 text-right" : "pr-8 text-left"
        }`}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {content}
      </p>
    </div>
  </div>
);

/* ── Main Component ── */
const PolicyFAQ = () => {
  const { t, language } = useLanguage();
  const [openPolicy, setOpenPolicy] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const policies = t.policySection?.policies || [];
  const faqs = t.policySection?.faqs || [];

  const isRTL = language === "ar";

  return (
    <section
      className="py-24"
      style={{
        background:
          "linear-gradient(135deg,#fffbf0 0%,#fef9ee 50%,#fff8f0 100%)",
      }}
      id="policy"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16">
          <div
            className={`grid md:grid-cols-2 gap-12 ${
              isRTL
                ? "md:divide-x-reverse md:divide-gray-200"
                : "md:divide-x md:divide-gray-200"
            }`}
          >
            {/* LEFT - POLICY */}
            <div className={isRTL ? "md:pl-12" : "md:pr-12"}>
              <h2
                className={`text-2xl font-bold mb-10 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t.policySection?.policyTitle}
              </h2>

              {policies.map((item, i) => (
                <AccordionItem
                  key={i}
                  title={item.title}
                  content={item.content}
                  isOpen={openPolicy === i}
                  onToggle={() =>
                    setOpenPolicy(openPolicy === i ? null : i)
                  }
                  isRTL={isRTL}
                />
              ))}
            </div>

            {/* RIGHT - FAQ */}
            <div className={isRTL ? "md:pr-12" : "md:pl-12"}>
              <h2
                className={`text-2xl font-bold mb-10 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t.policySection?.faqTitle}
              </h2>

              {faqs.map((item, i) => (
                <AccordionItem
                  key={i}
                  title={item.title}
                  content={item.content}
                  isOpen={openFaq === i}
                  onToggle={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                  accentColor
                  isRTL={isRTL}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PolicyFAQ;