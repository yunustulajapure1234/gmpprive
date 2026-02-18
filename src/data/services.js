export const serviceCategories = [
  {
    id: 'hair',
    name: 'Hair Services',
    nameAr: 'خدمات الشعر',
    icon: '✂️',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'spa',
    name: 'Spa & Massage',
    nameAr: 'السبا والتدليك',
    icon: '💆',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'beauty',
    name: 'Beauty Services',
    nameAr: 'خدمات التجميل',
    icon: '💄',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'nails',
    name: 'Nail Services',
    nameAr: 'خدمات الأظافر',
    icon: '💅',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'grooming',
    name: 'Men Grooming',
    nameAr: 'العناية بالرجال',
    icon: '🧔',
    color: 'from-gray-700 to-gray-900'
  },
  {
    id: 'waxing',
    name: 'Waxing Services',
    nameAr: 'خدمات إزالة الشعر',
    icon: '✨',
    color: 'from-teal-500 to-emerald-500'
  }
];

export const services = [
  // Hair Services
  {
    id: 'h1',
    category: 'hair',
    name: 'Haircut & Styling',
    nameAr: 'قص الشعر والتصفيف',
    description: 'Professional haircut with styling',
    descriptionAr: 'قصة شعر احترافية مع التصفيف',
    price: 150,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400'
  },
  {
    id: 'h2',
    category: 'hair',
    name: 'Hair Spa Treatment',
    nameAr: 'علاج سبا الشعر',
    description: 'Deep conditioning and nourishment',
    descriptionAr: 'ترطيب عميق وتغذية',
    price: 250,
    duration: '90 min',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'
  },
  {
    id: 'h3',
    category: 'hair',
    name: 'Hair Coloring',
    nameAr: 'صبغ الشعر',
    description: 'Full color or highlights',
    descriptionAr: 'لون كامل أو هايلايت',
    price: 350,
    duration: '120 min',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'
  },
  {
    id: 'h4',
    category: 'hair',
    name: 'Keratin Treatment',
    nameAr: 'علاج الكيراتين',
    description: 'Smoothing and straightening',
    descriptionAr: 'تنعيم وتمليس',
    price: 500,
    duration: '180 min',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400'
  },
  
  // Spa & Massage
  {
    id: 's1',
    category: 'spa',
    name: 'Relaxation Massage',
    nameAr: 'مساج الاسترخاء',
    description: 'Full body Swedish massage',
    descriptionAr: 'مساج سويدي للجسم بالكامل',
    price: 200,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'
  },
  {
    id: 's2',
    category: 'spa',
    name: 'Deep Tissue Massage',
    nameAr: 'تدليك الأنسجة العميقة',
    description: 'Intensive therapeutic massage',
    descriptionAr: 'تدليك علاجي مكثف',
    price: 250,
    duration: '75 min',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400'
  },
  {
    id: 's3',
    category: 'spa',
    name: 'Hot Stone Massage',
    nameAr: 'مساج الحجارة الساخنة',
    description: 'Heated stones therapy',
    descriptionAr: 'علاج بالحجارة الساخنة',
    price: 350,
    duration: '90 min',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
  },
  {
    id: 's4',
    category: 'spa',
    name: 'Couple Massage',
    nameAr: 'مساج للأزواج',
    description: 'Relaxing massage for two',
    descriptionAr: 'مساج مريح لشخصين',
    price: 500,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400'
  },
  
  // Beauty Services
  {
    id: 'b1',
    category: 'beauty',
    name: 'Facial Treatment',
    nameAr: 'علاج الوجه',
    description: 'Deep cleansing facial',
    descriptionAr: 'تنظيف عميق للوجه',
    price: 180,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400'
  },
  {
    id: 'b2',
    category: 'beauty',
    name: 'Bridal Makeup',
    nameAr: 'مكياج العروس',
    description: 'Complete bridal makeup package',
    descriptionAr: 'باقة مكياج العروس الكاملة',
    price: 800,
    duration: '120 min',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400'
  },
  {
    id: 'b3',
    category: 'beauty',
    name: 'Party Makeup',
    nameAr: 'مكياج الحفلات',
    description: 'Glamorous party makeup',
    descriptionAr: 'مكياج ساحر للحفلات',
    price: 300,
    duration: '75 min',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'
  },
  {
    id: 'b4',
    category: 'beauty',
    name: 'Threading & Eyebrow',
    nameAr: 'الخيط والحواجب',
    description: 'Eyebrow shaping and threading',
    descriptionAr: 'تشكيل الحواجب والخيط',
    price: 80,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400'
  },
  
  // Nail Services
  {
    id: 'n1',
    category: 'nails',
    name: 'Manicure',
    nameAr: 'مانيكير',
    description: 'Complete hand and nail care',
    descriptionAr: 'عناية كاملة باليد والأظافر',
    price: 100,
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'
  },
  {
    id: 'n2',
    category: 'nails',
    name: 'Pedicure',
    nameAr: 'باديكير',
    description: 'Complete foot and nail care',
    descriptionAr: 'عناية كاملة بالقدم والأظافر',
    price: 120,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400'
  },
  {
    id: 'n3',
    category: 'nails',
    name: 'Gel Polish',
    nameAr: 'طلاء الجل',
    description: 'Long-lasting gel manicure',
    descriptionAr: 'مانيكير جل طويل الأمد',
    price: 150,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400'
  },
  {
    id: 'n4',
    category: 'nails',
    name: 'Nail Art Design',
    nameAr: 'تصميم فن الأظافر',
    description: 'Custom nail art designs',
    descriptionAr: 'تصاميم فنية مخصصة للأظافر',
    price: 200,
    duration: '90 min',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400'
  },
  
  // Men Grooming
  {
    id: 'g1',
    category: 'grooming',
    name: 'Men Haircut',
    nameAr: 'قصة شعر رجالية',
    description: 'Professional men haircut',
    descriptionAr: 'قصة شعر احترافية للرجال',
    price: 80,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400'
  },
  {
    id: 'g2',
    category: 'grooming',
    name: 'Beard Grooming',
    nameAr: 'تهذيب اللحية',
    description: 'Beard trim and styling',
    descriptionAr: 'تشذيب وتصفيف اللحية',
    price: 60,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400'
  },
  {
    id: 'g3',
    category: 'grooming',
    name: 'Men Facial',
    nameAr: 'علاج وجه للرجال',
    description: 'Deep cleansing men facial',
    descriptionAr: 'تنظيف عميق للوجه للرجال',
    price: 150,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'
  },
  {
    id: 'g4',
    category: 'grooming',
    name: 'Head Massage',
    nameAr: 'تدليك الرأس',
    description: 'Relaxing head and scalp massage',
    descriptionAr: 'تدليك مريح للرأس وفروة الرأس',
    price: 100,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1621274790572-7c32596bc67f?w=400'
  },
  
  // Waxing Services
  {
    id: 'w1',
    category: 'waxing',
    name: 'Full Body Waxing',
    nameAr: 'إزالة شعر الجسم بالكامل',
    description: 'Complete body waxing',
    descriptionAr: 'إزالة شعر الجسم الكامل',
    price: 350,
    duration: '90 min',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
  },
  {
    id: 'w2',
    category: 'waxing',
    name: 'Arms & Legs Waxing',
    nameAr: 'إزالة شعر الذراعين والساقين',
    description: 'Arms and legs waxing',
    descriptionAr: 'إزالة شعر الذراعين والساقين',
    price: 200,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'
  },
  {
    id: 'w3',
    category: 'waxing',
    name: 'Facial Waxing',
    nameAr: 'إزالة شعر الوجه',
    description: 'Upper lip and face waxing',
    descriptionAr: 'إزالة شعر الشفة العليا والوجه',
    price: 80,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400'
  },
  {
    id: 'w4',
    category: 'waxing',
    name: 'Bikini Waxing',
    nameAr: 'إزالة شعر البيكيني',
    description: 'Professional bikini waxing',
    descriptionAr: 'إزالة شعر بيكيني احترافية',
    price: 150,
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=400'
  }
];
