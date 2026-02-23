import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useBooking } from "../context/BookingContext";
import { useAdmin } from "../context/AdminContext";
import ServiceDetailsModal from "../components/ServiceDetailsModal";

/* ─── floating salon icons ─── */
const SALON_ICONS = [
  { icon: "✂️", size: 28, top: "8%",  left: "4%",   dur: 4.2, delay: 0 },
  { icon: "💈", size: 22, top: "15%", left: "88%",   dur: 5.1, delay: 0.8 },
  { icon: "🪒", size: 20, top: "30%", left: "6%",    dur: 3.8, delay: 1.2 },
  { icon: "💆", size: 26, top: "25%", left: "92%",   dur: 4.7, delay: 0.4 },
  { icon: "🧴", size: 18, top: "50%", left: "2%",    dur: 5.5, delay: 1.6 },
  { icon: "💅", size: 22, top: "55%", left: "93%",   dur: 4.0, delay: 0.6 },
  { icon: "🪥", size: 18, top: "70%", left: "5%",    dur: 5.2, delay: 2.0 },
  { icon: "🛁", size: 24, top: "72%", left: "90%",   dur: 4.4, delay: 1.0 },
  { icon: "💄", size: 20, top: "88%", left: "7%",    dur: 3.9, delay: 0.3 },
  { icon: "🧖", size: 26, top: "85%", left: "89%",   dur: 5.0, delay: 1.4 },
  { icon: "✨", size: 16, top: "42%", left: "95%",   dur: 3.5, delay: 0.9 },
  { icon: "🌿", size: 18, top: "60%", left: "1%",    dur: 4.8, delay: 1.8 },
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
  <div style={{ background:"#fff", borderRadius:22, overflow:"hidden", border:"1px solid #f0ece4" }}>
    <div style={{ aspectRatio:"4/3", background:"linear-gradient(90deg,#f0ece4 25%,#faf7f0 50%,#f0ece4 75%)", backgroundSize:"200% 100%", animation:"skeletonShimmer 1.4s ease infinite" }} />
    <div style={{ padding:18, display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ height:15, background:"#f0ece4", borderRadius:8, width:"65%", animation:"skeletonShimmer 1.4s ease infinite" }} />
      <div style={{ height:11, background:"#f5f2ec", borderRadius:8, animation:"skeletonShimmer 1.4s ease .1s infinite" }} />
      <div style={{ height:11, background:"#f5f2ec", borderRadius:8, width:"80%", animation:"skeletonShimmer 1.4s ease .2s infinite" }} />
    </div>
  </div>
);

/* ════════════════════════════════════════════
   MAIN
════════════════════════════════════════════ */
const MenServices = () => {
  const { language } = useLanguage();
  const { cart, addToCart, removeFromCart, updateQuantity } = useBooking();
  const { getServicesByGender, getCategories } = useAdmin();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedService, setSelectedService]   = useState(null);
  const [isLoading, setIsLoading]               = useState(true);
  const [toast, setToast]                       = useState(null);

  const isAr = language === "ar";

  const services         = useMemo(() => getServicesByGender("men"), [getServicesByGender]);
  const categories       = useMemo(() => getCategories("men"),       [getCategories]);

  useEffect(() => {
    if (services.length > 0) { const t = setTimeout(() => setIsLoading(false), 600); return () => clearTimeout(t); }
  }, [services]);

  const filteredServices = useMemo(() => services.filter(s => {
    const matchCat = selectedCategory === "all" || s.category === selectedCategory;
    const matchQ   = !searchQuery || s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.nameAr?.includes(searchQuery);
    return matchCat && matchQ;
  }), [services, selectedCategory, searchQuery]);

  const getCartItem  = id  => cart.find(i => i._id === id);
  const getQty       = id  => { const i = getCartItem(id); return i ? i.quantity : 0; };
  const isMspa       = s   => { const c = s.category?.toLowerCase(); return c?.includes("massage") || c?.includes("spa"); };
  const showToast    = msg => setToast(msg);

  const handleAdd = (e, service) => {
    e.stopPropagation();
    addToCart({ ...service, selectedDuration: { minutes: parseInt(service.duration)||60, price: service.price }, quantity: 1 });
    showToast(isAr ? "✅ تمت الإضافة إلى السلة" : "✅ Added to cart");
  };
  const handleInc = (e, service) => {
    e.stopPropagation();
    addToCart({ ...service, selectedDuration: { minutes: parseInt(service.duration)||60, price: service.price }, quantity: 1 });
    showToast(isAr ? "➕ تمت زيادة الكمية" : "➕ Quantity increased");
  };
  const handleDec = (e, id) => {
    e.stopPropagation();
    const item = getCartItem(id);
    if (!item) return;
    if (item.quantity <= 1) { removeFromCart(item.id); showToast(isAr ? "🗑️ تم الإزالة" : "🗑️ Removed"); }
    else { updateQuantity(item.id, item.quantity - 1); showToast(isAr ? "➖ تم تقليل الكمية" : "➖ Quantity decreased"); }
  };

  const uniqueCategories = [...new Map(services.map(s => [s.category, { key: s.category, name: s.category, nameAr: s.categoryAr }])).values()];

  return (
    <div dir={isAr ? "rtl" : "ltr"} style={{ minHeight:"100vh", background:"#fdf9f3", paddingTop:100, position:"relative", overflow:"hidden" }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes toastPop        { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUpPage      { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatA          { 0%,100%{transform:translateY(0) rotate(-4deg) scale(1)} 50%{transform:translateY(-12px) rotate(4deg) scale(1.08)} }
        @keyframes floatB          { 0%,100%{transform:translateY(0) rotate(6deg) scale(1)} 50%{transform:translateY(-9px) rotate(-5deg) scale(1.06)} }
        @keyframes floatC          { 0%,100%{transform:translateY(0) rotate(-8deg) scale(1)} 50%{transform:translateY(-14px) rotate(6deg) scale(1.1)} }
        @keyframes pulseDot        { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.7);opacity:.4} }
        @keyframes goldShimmer     { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes skeletonShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes cardIn          { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .pf  { animation: fadeUpPage .55s ease both; }
        .pf1 { animation: fadeUpPage .55s .1s ease both; }
        .pf2 { animation: fadeUpPage .55s .18s ease both; }
        .pf3 { animation: fadeUpPage .55s .26s ease both; }

        .gold-heading {
          font-family:'Playfair Display',Georgia,serif;
          font-weight:900; line-height:1.15; letter-spacing:-.01em;
          color:#b45309;
          background:linear-gradient(120deg,#92400e,#d97706,#f59e0b,#d97706,#92400e);
          background-size:300% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:goldShimmer 5s linear infinite;
        }
        @supports not (-webkit-background-clip:text){
          .gold-heading { color:#b45309 !important; background:none !important; }
        }

        .cat-pill {
          font-family:'DM Sans',sans-serif;
          display:inline-flex; align-items:center; gap:6px;
          padding:7px 15px; border-radius:999px; font-size:12px; font-weight:600;
          letter-spacing:.03em; white-space:nowrap; cursor:pointer;
          border:1.5px solid rgba(200,150,42,.25);
          background:rgba(255,255,255,.88); color:#6b4c10;
          transition:all .2s ease; backdrop-filter:blur(6px);
          box-shadow:0 1px 6px rgba(0,0,0,.06);
        }
        .cat-pill:hover  { border-color:#d97706; box-shadow:0 4px 16px rgba(200,150,42,.24); transform:translateY(-2px); }
        .cat-pill.active { background:linear-gradient(135deg,#f59e0b,#92400e); border-color:transparent; color:#fff; box-shadow:0 6px 20px rgba(200,150,42,.42); transform:translateY(-2px); }
        .cat-count { font-size:10px; font-weight:800; padding:1px 7px; border-radius:999px; background:rgba(255,255,255,.25); }
        .cat-pill:not(.active) .cat-count { background:#fef3c7; color:#b45309; }

        .svc-card {
          background:#fff; border-radius:22px; overflow:hidden;
          border:1px solid rgba(200,150,42,.1); box-shadow:0 2px 14px rgba(0,0,0,.06);
          display:flex; flex-direction:column; cursor:pointer;
          transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease;
          animation:cardIn .5s ease both;
        }
        .svc-card:hover { transform:translateY(-7px); box-shadow:0 22px 48px rgba(0,0,0,.13); border-color:rgba(200,150,42,.35); }
        .svc-card:hover .card-img-inner { transform:scale(1.07); }
        .card-img-inner { width:100%; height:100%; object-fit:cover; display:block; transition:transform .7s ease; }

        .add-btn {
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:.05em; text-transform:uppercase;
          background:linear-gradient(135deg,#f59e0b,#92400e); color:#fff;
          border:none; border-radius:999px; padding:9px 18px; cursor:pointer;
          box-shadow:0 4px 14px rgba(200,150,42,.38); transition:all .2s ease; white-space:nowrap;
        }
        .add-btn:hover  { transform:scale(1.06); box-shadow:0 7px 20px rgba(200,150,42,.5); }
        .add-btn:active { transform:scale(.95); }

        .qty-wrap { display:flex; align-items:center; background:#faf5ec; border-radius:999px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,.08); }
        .qty-btn  { width:34px; height:34px; border:none; background:transparent; font-size:18px; font-weight:700; cursor:pointer; color:#555; display:flex; align-items:center; justify-content:center; transition:all .15s; }
        .qty-btn:hover { background:rgba(200,150,42,.12); color:#92400e; }
        .qty-btn.qplus { background:linear-gradient(135deg,#f59e0b,#92400e); color:#fff; }
        .qty-btn.qplus:hover { opacity:.88; }

        .search-box {
          font-family:'DM Sans',sans-serif; width:100%;
          padding:12px 18px 12px 44px; border-radius:14px;
          border:1.5px solid rgba(200,150,42,.22);
          background:rgba(255,255,255,.92); backdrop-filter:blur(8px);
          font-size:13px; font-weight:500; color:#1a1209;
          outline:none; box-shadow:0 2px 12px rgba(0,0,0,.06);
          transition:border-color .2s,box-shadow .2s;
        }
        .search-box:focus { border-color:#f59e0b; box-shadow:0 0 0 4px rgba(245,158,11,.13); }
        .search-box::placeholder { color:#c8b090; }

        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}

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

      {/* ── FLOATING ICONS (fixed, whole page) ── */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        {SALON_ICONS.map((ic, i) => (
          <span key={i} style={{
            position:"absolute", top:ic.top, left:ic.left, fontSize:ic.size,
            opacity:.13,
            animation:`${["floatA","floatB","floatC"][i%3]} ${ic.dur}s ${ic.delay}s ease-in-out infinite`,
            userSelect:"none", filter:"grayscale(15%)",
          }}>{ic.icon}</span>
        ))}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(200,150,42,.055) 1px,transparent 1px)", backgroundSize:"36px 36px" }} />
      </div>

      {/* ══ HEADER — compact ══ */}
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"16px 20px 22px" }}>

        {/* badge */}
        <div className="pf" style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 14px", borderRadius:999, border:"1px solid rgba(200,150,42,.28)", background:"linear-gradient(90deg,#fef3c7,#fde68a,#fef3c7)", boxShadow:"0 2px 12px rgba(200,150,42,.14)", marginBottom:10 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#f59e0b", display:"inline-block", animation:"pulseDot 1.8s ease-in-out infinite" }} />
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".16em", textTransform:"uppercase", color:"#92400e" }}>
            {isAr ? "🏠 نأتي إليك" : "🏠 We Come To You"}
          </span>
        </div>

        {/* heading */}
        <h1 className="gold-heading pf1" style={{ fontSize:"clamp(1.8rem,4.5vw,2.8rem)", margin:"0 0 8px" }}>
          {isAr ? "صالون فاخر يأتي إليك" : "Luxury Salon, At Your Door"}
        </h1>

        {/* divider */}
        <div className="pf1" style={{ margin:"0 auto 10px", width:46, height:3, borderRadius:999, background:"linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)" }} />

        {/* subtitle */}
        <p className="pf2" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(.82rem,1.8vw,.93rem)", color:"#7a5c28", maxWidth:440, margin:"0 auto", lineHeight:1.65, fontWeight:400 }}>
          {isAr
            ? "تجربة صالون احترافية في راحة منزلك — خبراء يأتون إليك"
            : "Professional grooming & care, delivered home — your comfort, our craft"}
        </p>
      </div>

      {/* ══ SEARCH + FILTER ══ */}
      <div style={{ position:"relative", zIndex:1, maxWidth:1280, margin:"0 auto", padding:"0 16px" }}>

        <div className="pf2" style={{ position:"relative", maxWidth:500, margin:"0 auto 16px" }}>
          <svg style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", width:16, height:16 }} fill="none" stroke="#c8a060" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            className="search-box" type="text"
            placeholder={isAr ? "ابحث عن خدمة..." : "Search services..."}
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* category pills */}
        <div className="pf3" style={{ position:"relative", marginBottom:20 }}>
          <div className="scrollbar-hide" style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:9, paddingInline:2 }}>
            <button className={`cat-pill ${selectedCategory==="all" ? "active" : ""}`} onClick={() => setSelectedCategory("all")}>
              {isAr ? "الكل" : "All"} <span className="cat-count">{services.length}</span>
            </button>
            {uniqueCategories.map(cat => {
              const cnt = services.filter(s => s.category === cat.key).length;
              return (
                <button key={cat.key} className={`cat-pill ${selectedCategory===cat.key ? "active" : ""}`} onClick={() => setSelectedCategory(cat.key)}>
                  {isAr ? cat.nameAr : cat.name} <span className="cat-count">{cnt}</span>
                </button>
              );
            })}
          </div>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1.5, background:"linear-gradient(90deg,transparent,rgba(200,150,42,.28),transparent)", pointerEvents:"none" }} />
        </div>

        {/* count */}
        {!isLoading && (
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, color:"#b8902a", fontWeight:500, marginBottom:16, letterSpacing:".04em" }}>
            {filteredServices.length} {isAr ? "خدمة متاحة" : "services available"}
          </p>
        )}

        {/* ══ GRID ══ */}
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
              const qty       = getQty(service._id);
              const massage   = isMspa(service);
              const basePrice = massage && service.durations?.length ? service.durations[0].price : service.price;

              return (
                <div
                  key={service._id} className="svc-card"
                  style={{ animationDelay:`${Math.min(idx*55,380)}ms` }}
                  onClick={() => { if (massage) setSelectedService(service); }}
                >
                  <div style={{ aspectRatio:"4/3", overflow:"hidden", background:"#f0ebe0", position:"relative" }}>
                    <img className="card-img-inner" src={service.imageUrl||service.image} alt={service.name} loading="lazy" />
                    <div style={{ position:"absolute", top:9, left:9, background:"rgba(255,255,255,.92)", backdropFilter:"blur(6px)", borderRadius:999, padding:"3px 10px", fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700, color:"#7a4f10", letterSpacing:".04em", border:"1px solid rgba(200,150,42,.18)" }}>
                      {isAr ? service.categoryAr : service.category}
                    </div>
                    {qty > 0 && (
                      <div style={{ position:"absolute", top:9, right:9, background:"linear-gradient(135deg,#f59e0b,#92400e)", color:"#fff", width:27, height:27, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:12, boxShadow:"0 2px 10px rgba(200,150,42,.5)" }}>
                        {qty}
                      </div>
                    )}
                  </div>

                  <div style={{ padding:"14px 16px 16px", display:"flex", flexDirection:"column", flex:1 }}>
                    <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:16, fontWeight:700, color:"#1a1209", margin:"0 0 5px", lineHeight:1.25, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical" }}>
                      {isAr ? service.nameAr : service.name}
                    </h3>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, color:"#9a8060", margin:"0 0 10px", lineHeight:1.55, flex:1, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {isAr ? service.descriptionAr : service.description}
                    </p>

                    {service.duration && (
                      <div style={{ display:"inline-flex", alignItems:"center", gap:4, marginBottom:10 }}>
                        <svg width="11" height="11" fill="none" stroke="#c8962a" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10.5, color:"#c8962a", fontWeight:600 }}>{service.duration} min</span>
                      </div>
                    )}

                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid #f3ece0", paddingTop:11, gap:8 }}>
                      <div>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9.5, fontWeight:700, color:"#c8a060", textTransform:"uppercase", letterSpacing:".07em", display:"block" }}>
                          {massage ? (isAr?"يبدأ من":"From") : (isAr?"السعر":"Price")}
                        </span>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#b45309", lineHeight:1.1 }}>
                          {basePrice}
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:600, color:"#c8a060", marginLeft:3 }}>AED</span>
                        </span>
                      </div>

                      {qty === 0 ? (
                        <button className="add-btn" onClick={e => massage ? setSelectedService(service) : handleAdd(e, service)}>
                          {massage ? (isAr?"اختر":"Select") : (isAr?"أضف +":"Add +")}
                        </button>
                      ) : (
                        <div className="qty-wrap" onClick={e => e.stopPropagation()}>
                          <button className="qty-btn" onClick={e => handleDec(e, service._id)}>−</button>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, padding:"0 12px", color:"#1a1209", minWidth:32, textAlign:"center" }}>{qty}</span>
                          <button className="qty-btn qplus" onClick={e => handleInc(e, service)}>+</button>
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

export default MenServices;