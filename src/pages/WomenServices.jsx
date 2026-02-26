import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useBooking } from "../context/BookingContext";
import { useAdmin } from "../context/AdminContext";
import ServiceDetailsModal from "../components/ServiceDetailsModal";

/* ─── floating salon icons — feminine theme ─── */
const SALON_ICONS = [
  { icon: "💄", size: 26, top: "8%",  left: "4%",   dur: 4.2, delay: 0 },
  { icon: "💅", size: 22, top: "14%", left: "88%",   dur: 5.1, delay: 0.8 },
  { icon: "🌸", size: 24, top: "28%", left: "5%",    dur: 3.8, delay: 1.2 },
  { icon: "✨", size: 18, top: "22%", left: "93%",   dur: 4.7, delay: 0.4 },
  { icon: "🪞", size: 22, top: "48%", left: "2%",    dur: 5.5, delay: 1.6 },
  { icon: "🌺", size: 20, top: "54%", left: "94%",   dur: 4.0, delay: 0.6 },
  { icon: "🧖", size: 24, top: "68%", left: "4%",    dur: 5.2, delay: 2.0 },
  { icon: "🛁", size: 22, top: "72%", left: "91%",   dur: 4.4, delay: 1.0 },
  { icon: "🌹", size: 20, top: "86%", left: "6%",    dur: 3.9, delay: 0.3 },
  { icon: "💆", size: 24, top: "84%", left: "88%",   dur: 5.0, delay: 1.4 },
  { icon: "🪷", size: 18, top: "40%", left: "96%",   dur: 3.5, delay: 0.9 },
  { icon: "🧴", size: 18, top: "62%", left: "1%",    dur: 4.8, delay: 1.8 },
];

/* ─── Toast ─── */
const Toast = ({ message, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position:"fixed", top:24, right:24, zIndex:9999, animation:"toastPop .3s ease" }}>
      <div style={{ background:"#fff", borderRadius:16, boxShadow:"0 8px 32px rgba(0,0,0,.15)", border:"1px solid #f0f0f0", padding:"14px 20px", display:"flex", alignItems:"center", gap:12, minWidth:260 }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <p style={{ fontSize:13, fontWeight:600, color:"#111", margin:0, fontFamily:"'DM Sans',sans-serif" }}>{message}</p>
      </div>
    </div>
  );
};

/* ─── Skeleton ─── */
const ServiceSkeleton = () => (
  <div style={{ background:"#fff", borderRadius:22, overflow:"hidden", border:"1px solid #fce7f3" }}>
    <div style={{ aspectRatio:"4/3", background:"linear-gradient(90deg,#fce7f3 25%,#fff5f8 50%,#fce7f3 75%)", backgroundSize:"200% 100%", animation:"skeletonShimmer 1.4s ease infinite" }} />
    <div style={{ padding:18, display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ height:15, background:"#fce7f3", borderRadius:8, width:"65%", animation:"skeletonShimmer 1.4s ease infinite" }} />
      <div style={{ height:11, background:"#fdf2f8", borderRadius:8, animation:"skeletonShimmer 1.4s ease .1s infinite" }} />
      <div style={{ height:11, background:"#fdf2f8", borderRadius:8, width:"80%", animation:"skeletonShimmer 1.4s ease .2s infinite" }} />
    </div>
  </div>
);

/* ════════════════════════════════════════════
   MAIN
════════════════════════════════════════════ */
const WomenServices = () => {
  const { language } = useLanguage();
  const { cart, addToCart, removeFromCart, updateQuantity } = useBooking();
  const { getServicesByGender, getCategories } = useAdmin();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedService, setSelectedService]   = useState(null);
  const [isLoading, setIsLoading]               = useState(true);
  const [toast, setToast]                       = useState(null);

  // carousel scroll state
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const pillsRef = useRef(null);

  const isAr = language === "ar";

  const services   = useMemo(() => getServicesByGender("women"), [getServicesByGender]);
  const categories = useMemo(() => getCategories("women"),       [getCategories]);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  useEffect(() => {
    if (services.length > 0) { const t = setTimeout(() => setIsLoading(false), 600); return () => clearTimeout(t); }
  }, [services]);

  // check scroll position to show/hide arrows
  const checkScroll = () => {
    const el = pillsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = pillsRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => { el.removeEventListener("scroll", checkScroll); window.removeEventListener("resize", checkScroll); };
  }, [services]);

  const scrollPills = (dir) => {
    const el = pillsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  const filteredServices = useMemo(() => services.filter(s => {
    const matchCat = selectedCategory === "all" || s.category === selectedCategory;
    const matchQ   = !searchQuery || s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.nameAr?.includes(searchQuery);
    return matchCat && matchQ;
  }), [services, selectedCategory, searchQuery]);

  const getCartItem  = id  => cart.find(i => i._id === id);
  const getQty       = id  => { const i = getCartItem(id); return i ? i.quantity : 0; };
  const isMspa       = s   => { const c = s.category?.toLowerCase(); return c?.includes("massage") || c?.includes("spa"); };
  const showToast    = msg => setToast(msg);

  const handleDirectAdd = (e, service) => {
    e.stopPropagation();
    addToCart({ ...service, selectedDuration: { minutes: parseInt(service.duration)||60, price: service.price }, quantity: 1 });
    showToast(isAr ? "✅ تمت الإضافة إلى السلة" : "✅ Added to cart successfully");
  };
  const handleIncrement = (e, service) => {
    e.stopPropagation();
    addToCart({ ...service, selectedDuration: { minutes: parseInt(service.duration)||60, price: service.price }, quantity: 1 });
    showToast(isAr ? "➕ تمت زيادة الكمية" : "➕ Quantity increased");
  };
  const handleDecrement = (e, serviceId) => {
    e.stopPropagation();
    const item = getCartItem(serviceId);
    if (!item) return;
    if (item.quantity <= 1) { removeFromCart(item.id); showToast(isAr ? "🗑️ تم الإزالة من السلة" : "🗑️ Removed from cart"); }
    else { updateQuantity(item.id, item.quantity - 1); showToast(isAr ? "➖ تم تقليل الكمية" : "➖ Quantity decreased"); }
  };

  const uniqueCategories = [...new Map(services.map(s => [s.category, { key: s.category, name: s.category, nameAr: s.categoryAr }])).values()];

  return (
    <div dir={isAr ? "rtl" : "ltr"} style={{ minHeight:"100vh", background:"#fff9fb", paddingTop:100, position:"relative", overflow:"hidden" }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes toastPop        { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUpPage      { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatA          { 0%,100%{transform:translateY(0) rotate(-4deg) scale(1)} 50%{transform:translateY(-12px) rotate(4deg) scale(1.08)} }
        @keyframes floatB          { 0%,100%{transform:translateY(0) rotate(6deg) scale(1)} 50%{transform:translateY(-9px) rotate(-5deg) scale(1.06)} }
        @keyframes floatC          { 0%,100%{transform:translateY(0) rotate(-8deg) scale(1)} 50%{transform:translateY(-14px) rotate(6deg) scale(1.1)} }
        @keyframes pulseDot        { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.7);opacity:.4} }
        @keyframes roseShimmer     { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes skeletonShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes cardIn          { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .pf  { animation: fadeUpPage .55s ease both; }
        .pf1 { animation: fadeUpPage .55s .1s ease both; }
        .pf2 { animation: fadeUpPage .55s .18s ease both; }
        .pf3 { animation: fadeUpPage .55s .26s ease both; }

        .rose-heading {
          font-family:'Playfair Display',Georgia,serif;
          font-weight:900; line-height:1.15; letter-spacing:-.01em;
          color:#9d174d;
          background:linear-gradient(120deg,#831843,#be185d,#f472b6,#be185d,#831843);
          background-size:300% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:roseShimmer 5s linear infinite;
        }
        @supports not (-webkit-background-clip:text){
          .rose-heading { color:#9d174d !important; background:none !important; }
        }

        /* ── CAROUSEL ARROWS ── */
        .pills-arrow {
          flex-shrink: 0;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid rgba(190,24,93,.22);
          background: rgba(255,255,255,.95);
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 12px rgba(190,24,93,.15);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .22s ease;
          color: #be185d;
        }
        .pills-arrow:hover {
          background: linear-gradient(135deg,#f472b6,#9d174d);
          border-color: transparent; color: #fff;
          box-shadow: 0 6px 20px rgba(190,24,93,.38);
          transform: scale(1.08);
        }
        .pills-arrow:disabled {
          opacity: 0; pointer-events: none;
        }

        /* fade edges on scroll container */
        .pills-fade-left  { background: linear-gradient(90deg, #fff9fb 60%, transparent); }
        .pills-fade-right { background: linear-gradient(270deg, #fff9fb 60%, transparent); }

        /* category pills */
        .cat-pill {
          font-family:'DM Sans',sans-serif;
          display:inline-flex; align-items:center; gap:6px;
          padding:7px 15px; border-radius:999px; font-size:12px; font-weight:600;
          letter-spacing:.03em; white-space:nowrap; cursor:pointer;
          border:1.5px solid rgba(190,24,93,.2);
          background:rgba(255,255,255,.9); color:#831843;
          transition:all .2s ease; backdrop-filter:blur(6px);
          box-shadow:0 1px 6px rgba(0,0,0,.05);
        }
        .cat-pill:hover  { border-color:#f472b6; box-shadow:0 4px 16px rgba(190,24,93,.2); transform:translateY(-2px); }
        .cat-pill.active { background:linear-gradient(135deg,#f472b6,#9d174d); border-color:transparent; color:#fff; box-shadow:0 6px 20px rgba(190,24,93,.38); transform:translateY(-2px); }
        .cat-count { font-size:10px; font-weight:800; padding:1px 7px; border-radius:999px; background:rgba(255,255,255,.28); }
        .cat-pill:not(.active) .cat-count { background:#fce7f3; color:#be185d; }

        .svc-card {
          background:#fff; border-radius:22px; overflow:hidden;
          border:1px solid rgba(252,231,243,.8);
          box-shadow:0 2px 14px rgba(0,0,0,.05);
          display:flex; flex-direction:column; cursor:pointer;
          transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease;
          animation:cardIn .5s ease both;
        }
        .svc-card:hover { transform:translateY(-7px); box-shadow:0 22px 48px rgba(190,24,93,.1); border-color:rgba(244,114,182,.4); }
        .svc-card:hover .card-img-inner { transform:scale(1.07); }
        .card-img-inner { width:100%; height:100%; object-fit:cover; display:block; transition:transform .7s ease; }

        .add-btn {
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:.05em; text-transform:uppercase;
          background:linear-gradient(135deg,#f472b6,#9d174d); color:#fff;
          border:none; border-radius:999px; padding:9px 18px; cursor:pointer;
          box-shadow:0 4px 14px rgba(190,24,93,.32); transition:all .2s ease; white-space:nowrap;
        }
        .add-btn:hover  { transform:scale(1.06); box-shadow:0 7px 20px rgba(190,24,93,.45); }
        .add-btn:active { transform:scale(.95); }

        .qty-wrap { display:flex; align-items:center; background:#fdf2f8; border-radius:999px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,.07); }
        .qty-btn  { width:34px; height:34px; border:none; background:transparent; font-size:18px; font-weight:700; cursor:pointer; color:#888; display:flex; align-items:center; justify-content:center; transition:all .15s; }
        .qty-btn:hover     { background:rgba(244,114,182,.15); color:#9d174d; }
        .qty-btn.qplus     { background:linear-gradient(135deg,#f472b6,#9d174d); color:#fff; }
        .qty-btn.qplus:hover { opacity:.88; }

        .search-box {
          font-family:'DM Sans',sans-serif; width:100%;
          padding:12px 18px 12px 44px; border-radius:14px;
          border:1.5px solid rgba(244,114,182,.25);
          background:rgba(255,255,255,.94); backdrop-filter:blur(8px);
          font-size:13px; font-weight:500; color:#1a0a10;
          outline:none; box-shadow:0 2px 12px rgba(0,0,0,.05);
          transition:border-color .2s,box-shadow .2s;
        }
        .search-box:focus { border-color:#f472b6; box-shadow:0 0 0 4px rgba(244,114,182,.13); }
        .search-box::placeholder { color:#e9a8c0; }

        .pills-track::-webkit-scrollbar { display:none; }
        .pills-track { -ms-overflow-style:none; scrollbar-width:none; }

        .svc-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
          gap:18px;
        }
        @media(max-width:480px){
          .svc-grid { grid-template-columns:repeat(2,1fr); gap:11px; }
          .svc-card  { border-radius:16px; }
        }
        @media(max-width:360px){
          .svc-grid { grid-template-columns:1fr; }
        }
      `}</style>

      {/* FLOATING ICONS */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        {SALON_ICONS.map((ic, i) => (
          <span key={i} style={{ position:"absolute", top:ic.top, left:ic.left, fontSize:ic.size, opacity:.12,
            animation:`${["floatA","floatB","floatC"][i%3]} ${ic.dur}s ${ic.delay}s ease-in-out infinite`, userSelect:"none" }}>{ic.icon}</span>
        ))}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(244,114,182,.055) 1px,transparent 1px)", backgroundSize:"36px 36px" }} />
      </div>

      {/* HEADER */}
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"16px 20px 22px" }}>
        <div className="pf" style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 14px", borderRadius:999, border:"1px solid rgba(244,114,182,.3)", background:"linear-gradient(90deg,#fce7f3,#fbcfe8,#fce7f3)", boxShadow:"0 2px 12px rgba(190,24,93,.12)", marginBottom:10 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#ec4899", display:"inline-block", animation:"pulseDot 1.8s ease-in-out infinite" }} />
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".16em", textTransform:"uppercase", color:"#9d174d" }}>
            {isAr ? "🏠 نأتي إليك" : "🏠 We Come To You"}
          </span>
        </div>
        <h1 className="rose-heading pf1" style={{ fontSize:"clamp(1.8rem,4.5vw,2.8rem)", margin:"0 0 8px" }}>
          {isAr ? "جمالك يبدأ في منزلك" : "Beauty, Delivered To You"}
        </h1>
        <div className="pf1" style={{ margin:"0 auto 10px", width:46, height:3, borderRadius:999, background:"linear-gradient(90deg,#f472b6,#fbcfe8,#f472b6)" }} />
        <p className="pf2" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(.82rem,1.8vw,.93rem)", color:"#9d4e6a", maxWidth:440, margin:"0 auto", lineHeight:1.65, fontWeight:400 }}>
          {isAr ? "خدمات تجميل احترافية في راحة منزلك — خبيرات يأتين إليك" : "Professional beauty & wellness services at home — our experts come to you"}
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ position:"relative", zIndex:1, maxWidth:1280, margin:"0 auto", padding:"0 16px" }}>

        {/* search */}
        <div className="pf2" style={{ position:"relative", maxWidth:500, margin:"0 auto 16px" }}>
          <svg style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", width:16, height:16 }} fill="none" stroke="#e9a8c0" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input className="search-box" type="text" placeholder={isAr ? "ابحث عن خدمة..." : "Search services..."} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {/* ══ CATEGORY CAROUSEL ══ */}
        <div className="pf3" style={{ position:"relative", marginBottom:20 }}>

          {/* left fade + arrow */}
          <div style={{ position:"absolute", left:0, top:0, bottom:9, width:60, zIndex:2, display:"flex", alignItems:"center", pointerEvents: canScrollLeft ? "auto" : "none" }}>
            <div className="pills-fade-left" style={{ position:"absolute", inset:0 }} />
            <button
              className="pills-arrow"
              disabled={!canScrollLeft}
              onClick={() => scrollPills(isAr ? 1 : -1)}
              style={{ position:"relative", zIndex:3, marginLeft:2 }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>

          {/* scrollable pills */}
          <div
            ref={pillsRef}
            className="pills-track"
            style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:9, paddingInline:"44px", scrollBehavior:"smooth" }}
          >
            <button
              className={`cat-pill ${selectedCategory==="all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              {isAr ? "الكل" : "All"} <span className="cat-count">{services.length}</span>
            </button>
            {uniqueCategories.map(cat => {
              const cnt = services.filter(s => s.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  className={`cat-pill ${selectedCategory===cat.key ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  {isAr ? cat.nameAr : cat.name} <span className="cat-count">{cnt}</span>
                </button>
              );
            })}
          </div>

          {/* right fade + arrow */}
          <div style={{ position:"absolute", right:0, top:0, bottom:9, width:60, zIndex:2, display:"flex", alignItems:"center", justifyContent:"flex-end", pointerEvents: canScrollRight ? "auto" : "none" }}>
            <div className="pills-fade-right" style={{ position:"absolute", inset:0 }} />
            <button
              className="pills-arrow"
              disabled={!canScrollRight}
              onClick={() => scrollPills(isAr ? -1 : 1)}
              style={{ position:"relative", zIndex:3, marginRight:2 }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          {/* bottom line */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1.5, background:"linear-gradient(90deg,transparent,rgba(244,114,182,.3),transparent)", pointerEvents:"none" }} />
        </div>

        {/* count */}
        {!isLoading && (
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, color:"#c06080", fontWeight:500, marginBottom:16, letterSpacing:".04em" }}>
            {filteredServices.length} {isAr ? "خدمة متاحة" : "services available"}
          </p>
        )}

        {/* GRID */}
        <div className="svc-grid" style={{ paddingBottom:72 }}>
          {isLoading ? (
            [...Array(8)].map((_,i) => <ServiceSkeleton key={i} />)
          ) : filteredServices.length === 0 ? (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"72px 0" }}>
              <div style={{ fontSize:52, marginBottom:14 }}>🔍</div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:600, color:"#9ca3af" }}>
                {isAr ? "لم يتم العثور على خدمات" : "No services found"}
              </p>
            </div>
          ) : (
            filteredServices.map((service, idx) => {
              const cartQty   = getQty(service._id);
              const massage   = isMspa(service);
              const basePrice = massage && service.durations?.length ? service.durations[0].price : service.price;
              return (
                <div
                  key={service._id} className="svc-card"
                  style={{ animationDelay:`${Math.min(idx*55,380)}ms` }}
                  onClick={() => { if (massage) setSelectedService(service); }}
                >
                  <div style={{ aspectRatio:"4/3", overflow:"hidden", background:"#fdf2f8", position:"relative" }}>
                    <img className="card-img-inner" src={service.imageUrl||service.image} alt={service.name} loading="lazy" />
                    <div style={{ position:"absolute", top:9, left:9, background:"rgba(255,255,255,.92)", backdropFilter:"blur(6px)", borderRadius:999, padding:"3px 10px", fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700, color:"#9d174d", letterSpacing:".04em", border:"1px solid rgba(244,114,182,.22)" }}>
                      {isAr ? service.categoryAr : service.category}
                    </div>
                    {cartQty > 0 && (
                      <div style={{ position:"absolute", top:9, right:9, background:"linear-gradient(135deg,#f472b6,#9d174d)", color:"#fff", width:27, height:27, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:12, boxShadow:"0 2px 10px rgba(190,24,93,.45)" }}>
                        {cartQty}
                      </div>
                    )}
                  </div>
                  <div style={{ padding:"14px 16px 16px", display:"flex", flexDirection:"column", flex:1 }}>
                    <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:700, color:"#1a0a10", margin:"0 0 5px", lineHeight:1.25, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical" }}>
                      {isAr ? service.nameAr : service.name}
                    </h3>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, color:"#a07080", margin:"0 0 10px", lineHeight:1.55, flex:1, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {isAr ? service.descriptionAr : service.description}
                    </p>
                    {service.duration && (
                      <div style={{ display:"inline-flex", alignItems:"center", gap:4, marginBottom:10 }}>
                        <svg width="11" height="11" fill="none" stroke="#e879a0" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10.5, color:"#e879a0", fontWeight:600 }}>{service.duration} min</span>
                      </div>
                    )}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid #fce7f3", paddingTop:11, gap:8 }}>
                      <div>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9.5, fontWeight:700, color:"#d4859a", textTransform:"uppercase", letterSpacing:".07em", display:"block" }}>
                          {massage ? (isAr?"يبدأ من":"From") : (isAr?"السعر":"Price")}
                        </span>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#9d174d", lineHeight:1.1 }}>
                          {basePrice}<span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:600, color:"#d4859a", marginLeft:3 }}>AED</span>
                        </span>
                      </div>
                      {cartQty === 0 ? (
                        <button className="add-btn" onClick={e => massage ? setSelectedService(service) : handleDirectAdd(e, service)}>
                          {massage ? (isAr?"اختري":"Select") : (isAr?"أضيفي +":"Add +")}
                        </button>
                      ) : (
                        <div className="qty-wrap" onClick={e => e.stopPropagation()}>
                          <button className="qty-btn" onClick={e => handleDecrement(e, service._id)}>−</button>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, padding:"0 12px", color:"#1a0a10", minWidth:32, textAlign:"center" }}>{cartQty}</span>
                          <button className="qty-btn qplus" onClick={e => handleIncrement(e, service)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSuccess={showToast}
        />
      )}
    </div>
  );
};

export default WomenServices;