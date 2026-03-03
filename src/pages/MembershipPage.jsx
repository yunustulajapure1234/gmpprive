import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./MembershipPage.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── Tier color config ── */
const tColor = (tier) => {
  switch (tier) {
    case 1:
      return {
        main: "#d97706",
        light: "rgba(217,119,6,0.08)",
        border: "rgba(217,119,6,0.25)"
      };

    case 2:
      return {
        main: "#9333ea",
        light: "rgba(147,51,234,0.08)",
        border: "rgba(147,51,234,0.25)"
      };

    case 3:
      return {
        main: "#3b82f6",
        light: "rgba(59,130,246,0.08)",
        border: "rgba(59,130,246,0.25)"
      };

    case 4:
      return {
        main: "#10b981",
        light: "rgba(16,185,129,0.08)",
        border: "rgba(16,185,129,0.25)"
      };

    default:
      return {
        main: "#d97706",
        light: "rgba(217,119,6,0.08)",
        border: "rgba(217,119,6,0.25)"
      };
  }
};
/* ══════════════════════════════════════════════
   ENROLL MODAL — WhatsApp inquiry
══════════════════════════════════════════════ */
const EnrollModal = ({ plan, onClose }) => {
  const c = tColor(plan.tier);
  const [step,    setStep]    = useState(1);
  const [chosen,  setChosen]  = useState(null);
  const [form,    setForm]    = useState({ name: "", phone: "", email: "" });
  const [sending, setSending] = useState(false);
  const [done,    setDone]    = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const send = async (e) => {
    e.preventDefault();
    setSending(true);
    const msg = encodeURIComponent(
      ` *New Membership Enquiry — GMP Privé*\n\n` +
      ` Name: ${form.name}\n` +
      ` Phone: ${form.phone}\n` +
      ` Email: ${form.email || "—"}\n\n` +
      ` Plan: Tier ${plan.tier} — ${plan.name} (AED ${plan.monthlyFee}/mo)\n` +
      ` Package: ${chosen ? `Option ${chosen.label} — ${chosen.title}` : "Not selected yet"}`
    );
    window.open(`https://wa.me/971528686112?text=${msg}`, "_blank");
    setSending(false);
    setDone(true);
  };

  return (
    <div className="mep-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mep-modal" style={{ "--mc": c.main, "--ml": c.light, "--mb": c.border }}>
        <button className="mep-close" onClick={onClose}>✕</button>

        {done ? (
          <div className="mep-done">
            <div className="mep-done-icon">✓</div>
            <h3>Request Sent!</h3>
            <p>Our team will confirm your membership on WhatsApp shortly.</p>
            <button className="mep-submit-btn" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="mep-modal-head">
              <span className="mep-modal-tier">TIER {plan.tier}</span>
              <h3>{plan.name}</h3>
              <p>AED <strong>{plan.monthlyFee}</strong>/month</p>
            </div>

            {step === 1 ? (
              <>
                <p className="mep-step-label">Step 1 — Choose your package option:</p>
                <div className={`mep-pkg-grid ${plan.subOptions?.length > 2 ? "mep-pkg-grid-4" : ""}`}>
                  {plan.subOptions?.map(pkg => (
                    <button key={pkg.label}
                      className={`mep-pkg-card ${chosen?.label === pkg.label ? "mep-pkg-active" : ""}`}
                      onClick={() => setChosen(pkg)}>
                      <div className="mep-pkg-head">
                        <span className="mep-pkg-lbl">{pkg.label}</span>
                        <span className="mep-pkg-ttl">{pkg.title}</span>
                        {pkg.value > 0 && <span className="mep-pkg-val">AED {pkg.value}</span>}
                      </div>
                      <ul>
                        {pkg.services?.split("\n").filter(Boolean).map((s, i) => (
                          <li key={i}>{s.replace(/^[•\-]\s*/, "")}</li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
                <button className="mep-submit-btn" onClick={() => setStep(2)}>
                  Continue {chosen ? `with Option ${chosen.label}` : "→"}
                </button>
              </>
            ) : (
              <form onSubmit={send} className="mep-form">
                <p className="mep-step-label">Step 2 — Your details:</p>
                {[
                  { k: "name",  label: "Full Name *",           type: "text",  req: true,  ph: "Your name"    },
                  { k: "phone", label: "Phone / WhatsApp *",    type: "tel",   req: true,  ph: "+971..."      },
                  { k: "email", label: "Email (optional)",      type: "email", req: false, ph: "you@email.com"},
                ].map(f => (
                  <div key={f.k} className="mep-field">
                    <label>{f.label}</label>
                    <input type={f.type} required={f.req} placeholder={f.ph}
                      value={form[f.k]} onChange={e => set(f.k, e.target.value)} />
                  </div>
                ))}
                <div className="mep-form-btns">
                  <button type="button" className="mep-back" onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className="mep-submit-btn" disabled={sending}>
                    {sending ? "Sending..." : "Send via WhatsApp →"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PLAN CARD — full detail
══════════════════════════════════════════════ */
const PlanCard = ({ plan, isHighlighted, onEnroll }) => {
  const c = tColor(plan.tier);
  const [openPkg, setOpenPkg] = useState(null);
  const savings = (plan.retailValue || 0) - plan.monthlyFee;

  return (
    <div className={`mep-card ${plan.tier === 2 ? "mep-card-t2" : "mep-card-t1"} ${isHighlighted ? "mep-highlighted" : ""}`}
      style={{ "--c": c.main, "--cl": c.light, "--cb": c.border }}>

      <div className="mep-topbar" />
      {plan.tier === 2 && <span className="mep-badge">MOST POPULAR</span>}

      {/* Header */}
      <div className="mep-card-head">
        <p className="mep-card-tier">TIER {plan.tier}</p>
        <h3 className="mep-card-name">{plan.name}</h3>
        {plan.description && <p className="mep-card-desc">{plan.description}</p>}
      </div>

      {/* Price */}
      <div className="mep-price-box">
        <div className="mep-price-row">
          <span className="mep-price-cur">AED</span>
          <span className="mep-price-num">{plan.monthlyFee}</span>
          <span className="mep-price-mo">/mo</span>
        </div>
        <div className="mep-price-meta">
          {plan.retailValue > 0 && (
            <span className="mep-retail">Retail AED {plan.retailValue}</span>
          )}
          {savings > 0 && (
            <span className="mep-save-pill">Save AED {savings}</span>
          )}
        </div>
        {plan.additionalDiscount > 0 && (
          <p className="mep-extra-disc">+{plan.additionalDiscount}% off on additional services</p>
        )}
      </div>

      {/* Included services */}
      {plan.includedServices && (
        <div className="mep-included">
          <p className="mep-sec-label">Every month includes:</p>
          <p className="mep-included-text">{plan.includedServices}</p>
        </div>
      )}

      {/* Sub-option packages */}
      {plan.subOptions?.length > 0 && (
        <div className="mep-options">
          <p className="mep-sec-label">Choose your add-on package:</p>
          {plan.subOptions.map(opt => (
            <div key={opt.label} className="mep-opt">
              <button
                className={`mep-opt-btn ${openPkg === opt.label ? "mep-opt-open" : ""}`}
                onClick={() => setOpenPkg(openPkg === opt.label ? null : opt.label)}>
                <span className="mep-opt-lbl">{opt.label}</span>
                <span className="mep-opt-name">{opt.title}</span>
                {opt.value > 0 && <span className="mep-opt-val">AED {opt.value}</span>}
                <span className="mep-opt-arrow">{openPkg === opt.label ? "▲" : "▼"}</span>
              </button>
              {openPkg === opt.label && (
                <ul className="mep-opt-detail">
                  {opt.services?.split("\n").filter(Boolean).map((s, i) => (
                    <li key={i}>
                      <span>◆</span>
                      {s.replace(/^[•\-]\s*/, "")}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Enroll CTA */}
      <button className="mep-enroll-btn" onClick={() => onEnroll(plan)}>
        Join Tier {plan.tier} — AED {plan.monthlyFee}/mo
        <span>→</span>
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const MembershipPage = () => {
  const [plans,      setPlans]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [enrollPlan, setEnrollPlan] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const highlightId    = searchParams.get("plan");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${BASE_URL}/api/membership/plans/public`)
      .then(r => r.json())
      .then(d => setPlans(d.data || []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  /* Auto-open enroll if ?plan= passed and match found */
  useEffect(() => {
    if (highlightId && plans.length > 0) {
      const found = plans.find(p => p._id === highlightId);
      if (found) {
        setTimeout(() => {
          document.getElementById(`plan-${found._id}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
  }, [plans, highlightId]);

  return (
    <div className="mep-page">

      {/* Hero */}
      <div className="mep-hero">
        <button className="mep-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <span className="mep-hero-eye">✦ EXCLUSIVE PLANS ✦</span>
        <h1 className="mep-hero-title">
          Prive <span>Membership</span>
        </h1>
        <p className="mep-hero-sub">
          One monthly fee. Premium beauty services delivered to your home — every month.
        </p>
        <div className="mep-trust-bar">
          {["🏠 At-Home Service", "📅 Monthly Plan", "⭐ Cancel Anytime", "💳 Easy Payment"].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="mep-plans-wrap">
        {loading ? (
          <div className="mep-loading">
            <div className="mep-spinner" />
            <p>Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="mep-empty">
            <p>No membership plans available right now.</p>
            <button onClick={() => navigate("/")}>← Back to Home</button>
          </div>
        ) : (
          <div className={`mep-plans-grid ${plans.length === 1 ? "mep-grid-1" : ""}`}>
            {plans.map(plan => (
              <div key={plan._id} id={`plan-${plan._id}`}>
                <PlanCard
                  plan={plan}
                  isHighlighted={plan._id === highlightId}
                  onEnroll={setEnrollPlan}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp help */}
      <div className="mep-help">
        <p>Not sure which plan is right for you?</p>
        <a href="https://wa.me/971528686112" target="_blank" rel="noreferrer" className="mep-wa-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.524 5.855L.057 23.25a.5.5 0 00.614.638l5.579-1.463A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.694-.493-5.25-1.357l-.374-.213-3.875 1.016 1.035-3.783-.232-.378A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Chat with us on WhatsApp
        </a>
      </div>

      {enrollPlan && (
        <EnrollModal plan={enrollPlan} onClose={() => setEnrollPlan(null)} />
      )}
    </div>
  );
};

export default MembershipPage;