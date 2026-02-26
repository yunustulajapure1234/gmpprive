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
      home: 'Home',
      about: 'About Us',
      forWomen: 'For Women',
      forMen: 'For Men',
      contact: 'Contact Us',
   packages: 'Packages',
services: 'Services',


    },
    banner: {
  items: [
    "🎉 Book Now & Get 20% OFF | Limited Time",
    "⭐ New Luxury Packages Available",
    "💎 Professional Home Beauty Services"
  ]
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
          description:
            "Customized weight loss & fitness programs at home.",
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
  title: "Wellness Needed More Than Appointments – It Needed Real Results",
  paragraphs: [
    "We watched people book dozens of salon appointments, beauty sessions, and fitness treatments — yet see no real transformation. Appointments were delivered. Outcomes were not. Wellness had become transactional.",
    "In every serious domain — finance, logistics, healthcare — operating systems replaced marketplaces. Wellness never got one. Until now.",
    "GMP Prive™ – The Intelligence Layer of Personal Wellness",
    "GMP Prive was born to be the intelligence layer of personal wellness — a revolutionary approach to beauty, body, and wellness management that goes beyond traditional salon and spa services.",
    "Starting in Dubai — where luxury meets innovation — we're building an intelligent wellness system that:",
    "Understands the human body through expert analysis and personalized consultation",
    "Predicts wellness needs before clients even realize them",
    "Delivers real, measurable results at home with professional expertise",
    "Manages complete wellness journeys rather than isolated appointments",
    "We Are Not Building a Services App. We Are Building the Future Infrastructure of Wellness.",
    "Traditional beauty salons, spas, and wellness centers operate as marketplaces — connecting clients with service providers for one-off appointments. GMP Prive operates differently."
  ]
},
    testimonials: {
  tag: "Testimonials",
  title: "See the impact we made on our clients",
  description: "Real experiences from our happy customers",
  items: [
    {
      name: "Mariana Bohorkez",
      service: "Hair & Makeup",
      text: "Amazing experience. The makeup was flawless and hair was exactly how I imagined."
    },
    {
      name: "Elena Grigorieva",
      service: "Hair Coloring",
      text: "Came for hair coloring and the result exceeded my expectations."
    },
    {
      name: "Iman Al Ansari",
      service: "Haircut & Blowdry",
      text: "Perfect haircut and blowdry. The team understood exactly what I wanted."
    }
  ]
},
policySection: {
  policyTitle: "OUR POLICY",
  faqTitle: "FAQS",
  policies: [
    {
      title: "OUR SERVICE GUARANTEE",
      content:
        "Every service delivered by GMP Privé is backed by our quality guarantee. If you are not satisfied, we will re-do the service at no charge within 48 hours.",
    },
    {
      title: "REFUNDS",
      content:
        "Refunds are available for cancellations made at least 4 hours before the scheduled service time.",
    },
    {
      title: "RESCHEDULE",
      content:
        "Please reach out to us on WhatsApp to change the time or date of your service at least 4 hours before the scheduled booking.",
    },
    {
      title: "CANCELLATION",
      content:
        "Cancellations made less than 4 hours before the appointment are subject to a 50% cancellation fee.",
    },
    {
      title: "PRIVACY",
      content:
        "Your personal information is strictly confidential. We do not share, sell, or distribute your data.",
    },
  ],
  faqs: [
    {
      title: "HOW DO I SCHEDULE AN APPOINTMENT?",
      content:
        "You can book directly through our website, via WhatsApp, or by calling us.",
    },
    {
      title: "WHAT ARE THE OPERATING HOURS?",
      content:
        "We are available 7 days a week from 9:00 AM to 10:00 PM.",
    },
    {
      title: "HOW DO I PAY FOR THE HOME SERVICE?",
      content:
        "We accept cash, credit/debit cards, and bank transfers.",
    },
  ],
},

contact: {
      tag: 'Contact Us',
      description: 'Visit our modern salon for premium services',
      address: 'Address',
      addressText: 'Home Massage Services\nAl Barsha Heights, Dubai, UAE',
      call: 'Call',
      whatsapp: 'WhatsApp',
      email: 'Email'
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
}

  },

 ar: {
  nav: {
    home: 'الرئيسية',
    about: 'من نحن',
    forWomen: 'للنساء',
    forMen: 'للرجال',
    contact: 'اتصل بنا',
    packages: 'الباقات',
services: 'الخدمات',

  },
banner: {
  items: [
    "🎉 احجز الآن واحصل على خصم 20٪ | لفترة محدودة",
    "⭐ باقات فاخرة جديدة متاحة",
    "💎 خدمات تجميل منزلية احترافية"
  ]
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
  title: "العافية تحتاج إلى أكثر من المواعيد – إنها تحتاج إلى نتائج حقيقية",
  paragraphs: [
    "لقد شاهدنا أشخاصًا يحجزون عشرات مواعيد الصالونات وجلسات التجميل واللياقة البدنية — ومع ذلك لم يشهدوا أي تحول حقيقي. تم تنفيذ المواعيد، لكن النتائج لم تتحقق. أصبحت العافية مجرد معاملة تجارية.",
    "في كل مجال جاد — مثل التمويل والخدمات اللوجستية والرعاية الصحية — استبدلت أنظمة التشغيل نماذج الأسواق. أما العافية، فلم تحصل على نظامها بعد. حتى الآن.",
    "GMP Prive™ – طبقة الذكاء للعافية الشخصية",
    "وُلدت GMP Prive لتكون طبقة الذكاء للعافية الشخصية — نهجًا ثوريًا لإدارة الجمال والجسم والعافية يتجاوز خدمات الصالونات ومراكز السبا التقليدية.",
    "انطلاقًا من دبي — حيث تلتقي الفخامة بالابتكار — نحن نبني نظامًا ذكيًا للعافية يقوم بـ:",
    "فهم جسم الإنسان من خلال تحليل احترافي واستشارات مخصصة",
    "التنبؤ باحتياجات العافية قبل أن يدركها العملاء",
    "تقديم نتائج حقيقية وقابلة للقياس في المنزل بخبرة احترافية",
    "إدارة رحلة العافية الكاملة بدلاً من مواعيد منفصلة",
    "نحن لا نبني تطبيق خدمات. نحن نبني البنية التحتية المستقبلية للعافية.",
    "تعمل الصالونات ومراكز السبا والعافية التقليدية كنماذج سوقية تربط العملاء بمقدمي الخدمات لمواعيد فردية. أما GMP Prive فتعمل بطريقة مختلفة."
  ]
},
      testimonials: {
      tag: 'الشهادات',
      title: 'انظر التأثير الذي أحدثناه على عملائنا',
      description: 'تجارب حقيقية من عملائنا السعداء',
      items: [
        {
          name: 'ماريانا بوهوركيز',
          service: 'الشعر والمكياج',
          text: 'تجربة رائعة. كان المكياج جميلًا والشعر تم بالضبط كما تخيلت. ينصح به بشدة!'
        },
        {
          name: 'إلينا غريغوريفا',
          service: 'صبغ الشعر',
          text: 'جئت هنا لصبغ الشعر والنتيجة كانت تفوق توقعاتي. موظفين محترفين وودودين للغاية.'
        },
        {
          name: 'إيمان الأنصاري',
          service: 'قص الشعر والتجفيف',
          text: 'قصة شعر مثالية وتجفيف. فهم الفريق بالضبط ما أردت. بالتأكيد سأعود مرة أخرى.'
        }
      ]
    },
    policySection: {
  policyTitle: "سياستنا",
  faqTitle: "الأسئلة الشائعة",
  policies: [
    {
      title: "ضمان الخدمة",
      content:
        "كل خدمة مقدمة من GMP Privé مدعومة بضمان الجودة. إذا لم تكن راضيًا، سنعيد تنفيذ الخدمة مجانًا خلال 48 ساعة.",
    },
    {
      title: "الاسترداد",
      content:
        "يتوفر استرداد المبلغ في حال الإلغاء قبل 4 ساعات على الأقل من موعد الخدمة.",
    },
    {
      title: "إعادة الجدولة",
      content:
        "يرجى التواصل معنا عبر واتساب لتغيير وقت أو تاريخ الخدمة قبل 4 ساعات من الموعد.",
    },
    {
      title: "الإلغاء",
      content:
        "الإلغاء قبل أقل من 4 ساعات يخضع لرسوم إلغاء بنسبة 50٪.",
    },
    {
      title: "الخصوصية",
      content:
        "معلوماتك الشخصية سرية تمامًا. نحن لا نشارك أو نبيع بياناتك.",
    },
  ],
  faqs: [
    {
      title: "كيف يمكنني حجز موعد؟",
      content:
        "يمكنك الحجز عبر موقعنا الإلكتروني أو واتساب أو الاتصال بنا.",
    },
    {
      title: "ما هي ساعات العمل؟",
      content:
        "نحن متاحون 7 أيام في الأسبوع من 9 صباحًا حتى 10 مساءً.",
    },
    {
      title: "كيف أدفع مقابل الخدمة المنزلية؟",
      content:
        "نقبل الدفع نقدًا أو عبر البطاقات البنكية أو التحويل البنكي.",
    },
  ],
},

    contact: {
      tag: 'اتصل بنا',
      description: 'قم بزيارة صالوننا الحديث للحصول على خدمات مميزة',
      address: 'العنوان',
      addressText: 'خدمات التدليك المنزلي\nمرتفعات البرشاء، دبي، الإمارات',
      call: 'اتصل',
      whatsapp: 'واتساب',
      email: 'البريد الإلكتروني'
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
}

  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

 const toggleLanguage = () => {
  const y = window.scrollY;
  setLanguage(prev => (prev === "en" ? "ar" : "en"));
  setTimeout(() => window.scrollTo(0, y), 0);
};


  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div dir={language === "ar" ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  );
};
