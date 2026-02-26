import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const TermsConditions = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // ✅ Correct place for useEffect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen mt-16 py-20 px-6 ${isRTL ? "text-right" : "text-left"}`}>
        
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {isRTL ? "الشروط والأحكام" : "Terms & Conditions"}
        </h1>

        <p className="mb-6">
          {isRTL
            ? "باستخدامك لموقع GMP Privé أو حجز أي خدمة، فإنك توافق على الالتزام بهذه الشروط وفق قوانين دولة الإمارات العربية المتحدة."
            : "By accessing GMP Privé or booking any service, you agree to comply with these Terms & Conditions under the laws of the United Arab Emirates."}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {isRTL ? "1. الخدمات" : "1. Services"}
        </h2>
        <p>
          {isRTL
            ? "نقدم خدمات صالون وسبا منزلية احترافية داخل دولة الإمارات. قد تختلف الخدمات حسب التوفر."
            : "We provide professional home salon and spa services across the UAE. Services are subject to availability."}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {isRTL ? "2. الدفع" : "2. Payments"}
        </h2>
        <p>
          {isRTL
            ? "قد يُطلب الدفع المسبق لتأكيد الحجز. جميع المعاملات تتم عبر بوابات دفع آمنة."
            : "Advance payment may be required to confirm bookings. All transactions are processed via secure payment gateways."}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {isRTL ? "3. المسؤولية" : "3. Liability"}
        </h2>
        <p>
          {isRTL
            ? "تقتصر مسؤوليتنا على قيمة الخدمة المدفوعة فقط. لا نتحمل أي أضرار غير مباشرة."
            : "Our liability is strictly limited to the value of the service paid. We are not responsible for indirect damages."}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {isRTL ? "4. القانون الحاكم" : "4. Governing Law"}
        </h2>
        <p>
          {isRTL
            ? "تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة."
            : "These terms are governed by the laws of the United Arab Emirates."}
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;