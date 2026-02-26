import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      forWomen: "For Women",
      forMen: "For Men",
      contact: "Contact Us",
      packages: "Packages",
      services: "Services",
    },
    banner: {
      items: [
        "🎉 Book Now & Get 20% OFF | Limited Time",
        "⭐ New Luxury Packages Available",
        "💎 Professional Home Beauty Services",
      ],
    },
    hero: {
      slides: [
        {
          title: "Professional Hair Cutting at Home",
          description:
            "Salon-quality haircuts by expert stylists at your doorstep.",
          cta: "Book Now",
        },
        {
          title: "Relaxing Home Massage Therapy",
          description:
            "Rejuvenate your body with certified massage professionals at home.",
          cta: "Book Now",
        },
        {
          title: "Beauty & Parlour Services at Home",
          description:
            "Personalized beauty treatments without stepping outside.",
          cta: "Book Now",
        },
        {
          title: "IV Therapy at Home",
          description:
            "Boost energy, immunity & hydration with professional IV therapy.",
          cta: "Consult Now",
        },
        {
          title: "Personal Fitness Training",
          description: "Customized weight loss & fitness programs at home.",
          cta: "Get Started",
        },
        {
          title: "Home Physiotherapy Services",
          description:
            "Expert physiotherapy sessions for pain relief & recovery.",
          cta: "Book Session",
        },
      ],
    },
   about: {
  tag: "Message from the Founders",
  title: "Beyond Appointments — Real Wellness Results in Dubai",
  paragraphs: [
    "Most people book salon after salon yet see no real transformation. Appointments were delivered. Results were not. We built GMP Prive™ to change that.",
    "GMP Prive™ is Dubai's first intelligent wellness system — combining luxury beauty, spa, and fitness services with personalized care that actually transforms.",
    "We don't just book your appointment. We understand your body, predict your needs, and deliver measurable results — at home, with professional expertise.",
    "Starting in Dubai. Building the future of personal wellness.",
  ],
  
},
    testimonials: {
      tag: "Testimonials",
      title: "See the impact we made on our clients",
      description: "Real experiences from our happy customers",
      items: [
        {
          name: "Mariana Bohorkez",
          service: "Hair & Makeup",
          text: "Amazing experience. The makeup was flawless and hair was exactly how I imagined.",
        },
        {
          name: "Elena Grigorieva",
          service: "Hair Coloring",
          text: "Came for hair coloring and the result exceeded my expectations.",
        },
        {
          name: "Iman Al Ansari",
          service: "Haircut & Blowdry",
          text: "Perfect haircut and blowdry. The team understood exactly what I wanted.",
        },
      ],
    },
    policySection: {
      policyTitle: "OUR POLICY",
      faqTitle: "FREQUENTLY ASKED QUESTIONS",

      policies: [
        {
          title: "OUR SERVICE GUARANTEE",
          content:
            "GMP Privé delivers professional, hygienic, and premium salon & spa services across the UAE. All professionals are fully trained and vetted. Tools are sanitized before every visit and premium products are used where appropriate. Services are delivered with full discretion and privacy.",
        },
        {
          title: "SATISFACTION WINDOW",
          content:
            "If you are not satisfied, you must notify us within 12 hours after service completion. After review, we may offer a corrective session or a service credit valid for 30 days. Cash refunds will not be issued where corrective action is possible.",
        },
        {
          title: "CLIENT RESPONSIBILITY",
          content:
            "Clients must disclose allergies, medical conditions, pregnancy, skin sensitivities, or recent surgeries before service. GMP Privé is not responsible for reactions caused by undisclosed conditions.",
        },
        {
          title: "RIGHT TO REFUSE SERVICE",
          content:
            "We reserve the right to refuse or discontinue service in case of health risks, unsafe environments, or inappropriate behavior.",
        },
        {
          title: "REFUNDS",
          content:
            "Completed or partially completed services are non-refundable. Eligible cancellations are converted into service credits. Subscription fees are non-refundable once activated. Billing errors such as duplicate charges will be refunded within 7–14 business days after verification.",
        },
        {
          title: "RESCHEDULING",
          content:
            "Appointments may be rescheduled up to 6 hours prior to service without fee. Late rescheduling within 6 hours may incur a 50 AED fee subject to availability.",
        },
        {
          title: "CANCELLATION POLICY",
          content:
            "Cancellations up to 6 hours before service are free. Cancellations within 6 hours are subject to 50% charge. If the therapist has arrived or the service has started, full payment applies.",
        },
        {
          title: "NO-SHOW POLICY",
          content:
            "If the client is unavailable 15 minutes past the scheduled time, the booking will be marked as no-show and charged in full.",
        },
        {
          title: "PRIVACY",
          content:
            "We collect necessary booking details including name, contact, address and payment confirmation. Payments are processed via secure third parties and card details are never stored. Personal data is never sold or shared except where required under UAE law.",
        },
        {
          title: "LEGAL & LIABILITY",
          content:
            "By confirming a booking or making payment, you agree to our terms under UAE law. Our maximum liability is limited to the service amount paid. All disputes are governed by UAE laws.",
        },
      ],

      faqs: [
        {
          title: "HOW DO I BOOK?",
          content:
            "Bookings can be made via our website, WhatsApp, or phone. Confirmation is required to secure the appointment.",
        },
        {
          title: "WHAT ARE YOUR OPERATING HOURS?",
          content:
            "We operate daily from 10:00 AM to 10:00 PM. Timings may vary during holidays or peak periods.",
        },
        {
          title: "HOW DO I PAY?",
          content:
            "Payments can be made via secure online payment, card, or approved digital transfer. Full advance payment may be required for certain bookings.",
        },
      ],
    },

    contact: {
      tag: "Contact Us",
      description: "Visit our modern salon for premium services",
      address: "Address",
      addressText: "Home Massage Services\nAl Barsha Heights, Dubai, UAE",
      call: "Call",
      whatsapp: "WhatsApp",
      email: "Email",
    },
    footer: {
      brandTag: "Beauty And Fitness",
      description:
        "Premium home salon & spa services in Dubai. Experience true luxury and professional care at your doorstep.",
      quickLinks: "Quick Links",
      contact: "Contact Us",
      links: {
        home: "Home",
        services: "Services",
        packages: "Packages",
        faqs: "FAQs",
        privacy: "Privacy Policy",
        about: "About Us",
      },
      rights: "All Rights Reserved.",
    },
  },

  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      forWomen: "للنساء",
      forMen: "للرجال",
      contact: "اتصل بنا",
      packages: "الباقات",
      services: "الخدمات",
    },
    banner: {
      items: [
        "🎉 احجز الآن واحصل على خصم 20٪ | لفترة محدودة",
        "⭐ باقات فاخرة جديدة متاحة",
        "💎 خدمات تجميل منزلية احترافية",
      ],
    },

    hero: {
      slides: [
        {
          title: "قص الشعر الاحترافي في المنزل",
          description: "خدمة صالون احترافية عند باب منزلك.",
          cta: "احجز الآن",
        },
        {
          title: "جلسات مساج منزلية",
          description: "استرخِ مع أفضل خبراء المساج في منزلك.",
          cta: "احجز الآن",
        },
        {
          title: "خدمات التجميل في المنزل",
          description: "علاجات تجميل مخصصة بدون مغادرة المنزل.",
          cta: "احجز الآن",
        },
        {
          title: "العلاج الوريدي في المنزل",
          description: "تعزيز الطاقة والمناعة بطرق احترافية.",
          cta: "استشارة",
        },
        {
          title: "تدريب لياقة بدنية شخصي",
          description: "برامج لياقة مخصصة في المنزل.",
          cta: "ابدأ الآن",
        },
        {
          title: "العلاج الطبيعي في المنزل",
          description: "جلسات علاج طبيعي لتخفيف الألم.",
          cta: "احجز جلسة",
        },
      ],
    },
  about: {
  tag: "رسالة من المؤسسين",
  title: "ما وراء المواعيد — نتائج عافية حقيقية في دبي",
  paragraphs: [
    "يحجز كثيرون موعدًا تلو الآخر، دون أن يروا أي تحول حقيقي. المواعيد تُنفَّذ، لكن النتائج لا تتحقق. أسسنا GMP Prive™ لنغيّر هذا الواقع.",
    "GMP Prive™ هو أول نظام ذكي للعافية الشخصية في دبي — يجمع بين خدمات التجميل الفاخرة والسبا واللياقة البدنية مع رعاية مخصصة تُحدث فرقًا حقيقيًا.",
    "لا نحجز لك موعدًا فحسب — بل نفهم جسمك، ونتوقع احتياجاتك، ونقدم نتائج قابلة للقياس في منزلك بخبرة احترافية.",
    "انطلقنا من دبي. ونبني مستقبل العافية الشخصية.",
  ],
  
},
    testimonials: {
      tag: "الشهادات",
      title: "انظر التأثير الذي أحدثناه على عملائنا",
      description: "تجارب حقيقية من عملائنا السعداء",
      items: [
        {
          name: "ماريانا بوهوركيز",
          service: "الشعر والمكياج",
          text: "تجربة رائعة. كان المكياج جميلًا والشعر تم بالضبط كما تخيلت. ينصح به بشدة!",
        },
        {
          name: "إلينا غريغوريفا",
          service: "صبغ الشعر",
          text: "جئت هنا لصبغ الشعر والنتيجة كانت تفوق توقعاتي. موظفين محترفين وودودين للغاية.",
        },
        {
          name: "إيمان الأنصاري",
          service: "قص الشعر والتجفيف",
          text: "قصة شعر مثالية وتجفيف. فهم الفريق بالضبط ما أردت. بالتأكيد سأعود مرة أخرى.",
        },
      ],
    },
    policySection: {
      policyTitle: "سياسة الشركة",
      faqTitle: "الأسئلة الشائعة",

      policies: [
        {
          title: "ضمان الخدمة",
          content:
            "تقدم GMP Privé خدمات صالون وسبا احترافية وفاخرة وفق أعلى معايير النظافة في جميع أنحاء دولة الإمارات. جميع المختصين مدربون ومعتمدون، ويتم تعقيم الأدوات قبل كل زيارة مع استخدام منتجات عالية الجودة.",
        },
        {
          title: "فترة الرضا عن الخدمة",
          content:
            "في حال عدم الرضا، يجب إخطارنا خلال 12 ساعة من انتهاء الخدمة. بعد المراجعة، قد يتم تقديم جلسة تصحيحية أو رصيد خدمة صالح لمدة 30 يومًا. لا يتم إصدار استرداد نقدي إذا كان بالإمكان تصحيح الخدمة.",
        },
        {
          title: "مسؤولية العميل",
          content:
            "يجب على العميل الإفصاح عن أي حساسية أو حالات طبية أو حمل أو عمليات جراحية حديثة قبل بدء الخدمة. لا تتحمل الشركة أي مسؤولية عن مضاعفات ناتجة عن عدم الإفصاح.",
        },
        {
          title: "الحق في رفض الخدمة",
          content:
            "يحق لنا رفض أو إيقاف الخدمة في حال وجود مخاطر صحية أو بيئة غير آمنة أو سلوك غير لائق.",
        },
        {
          title: "سياسة الاسترداد",
          content:
            "الخدمات المنجزة كليًا أو جزئيًا غير قابلة للاسترداد. يتم تحويل الإلغاءات المؤهلة إلى رصيد خدمة. رسوم الاشتراكات غير قابلة للاسترداد بعد التفعيل. يتم معالجة أخطاء الفوترة خلال 7 إلى 14 يوم عمل.",
        },
        {
          title: "إعادة الجدولة",
          content:
            "يمكن إعادة جدولة الموعد قبل 6 ساعات دون رسوم. في حال التأخير أقل من 6 ساعات قد يتم فرض رسوم 50 درهم حسب التوفر.",
        },
        {
          title: "سياسة الإلغاء",
          content:
            "الإلغاء قبل 6 ساعات مجاني. الإلغاء خلال أقل من 6 ساعات يخضع لرسوم 50٪. في حال وصول المختص أو بدء الخدمة يتم احتساب الرسوم كاملة.",
        },
        {
          title: "سياسة عدم الحضور",
          content:
            "في حال عدم حضور العميل خلال 15 دقيقة من وقت الموعد، يتم اعتبار الحجز ملغى مع احتساب كامل الرسوم.",
        },
        {
          title: "الخصوصية",
          content:
            "نقوم بجمع بيانات الحجز الأساسية فقط ويتم معالجة المدفوعات عبر جهات آمنة. لا نقوم بتخزين بيانات البطاقات أو مشاركة المعلومات إلا وفقًا للقانون الإماراتي.",
        },
        {
          title: "المسؤولية القانونية",
          content:
            "بمجرد تأكيد الحجز أو الدفع، فإنك توافق على الشروط وفق قوانين دولة الإمارات العربية المتحدة. الحد الأقصى للمسؤولية يقتصر على قيمة الخدمة المدفوعة.",
        },
      ],

      faqs: [
        {
          title: "كيف يمكنني الحجز؟",
          content:
            "يمكن الحجز عبر الموقع الإلكتروني أو واتساب أو الاتصال المباشر. يتم تثبيت الحجز بعد التأكيد.",
        },
        {
          title: "ما هي ساعات العمل؟",
          content:
            "نعمل يوميًا من الساعة 10 صباحًا حتى 10 مساءً، وقد تختلف المواعيد خلال المواسم المزدحمة.",
        },
        {
          title: "كيف يتم الدفع؟",
          content:
            "يتم الدفع عبر وسائل إلكترونية آمنة أو بطاقات الدفع المعتمدة. قد يُطلب الدفع المسبق لبعض الخدمات.",
        },
      ],
    },

    contact: {
      tag: "اتصل بنا",
      description: "قم بزيارة صالوننا الحديث للحصول على خدمات مميزة",
      address: "العنوان",
      addressText: "خدمات التدليك المنزلي\nمرتفعات البرشاء، دبي، الإمارات",
      call: "اتصل",
      whatsapp: "واتساب",
      email: "البريد الإلكتروني",
    },
    footer: {
      brandTag: "صالون وسبا فاخر",
      description:
        "خدمات صالون وسبا فاخرة في منزلك. تجربة الفخامة والعناية والكمال.",
      quickLinks: "روابط سريعة",
      contact: "اتصل بنا",
      links: {
        home: "الرئيسية",
        services: "الخدمات",
        packages: "الباقات",
        faqs: "الأسئلة الشائعة",
        privacy: "سياسة الخصوصية",
        about: "من نحن",
      },
      rights: "جميع الحقوق محفوظة.",
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    const y = window.scrollY;
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
    setTimeout(() => window.scrollTo(0, y), 0);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div dir={language === "ar" ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  );
};
