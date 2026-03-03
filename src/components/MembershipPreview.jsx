import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MembershipPreview.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MembershipPreview = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const secRef = useRef(null);

  /* ===== Fetch plans ===== */
  useEffect(() => {
    fetch(`${BASE_URL}/api/membership/plans/public`)
      .then((r) => r.json())
      .then((d) => setPlans(d.data || []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  /* ===== Scroll animation ===== */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting)
          secRef.current?.classList.add("mp-visible");
      },
      { threshold: 0.1 }
    );

    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  /* ===== Dynamic 4 Color System ===== */
  const getCardClass = (tier) => {
    switch (tier) {
      case 1:
        return "mp-card-gold";
      case 2:
        return "mp-card-purple";
      case 3:
        return "mp-card-blue";
      case 4:
        return "mp-card-emerald";
      default:
        return "mp-card-gold";
    }
  };

  return (
    <section ref={secRef} className="mp-section" id="membership">
      <div className="mp-container">

        {/* Header */}
        <div className="mp-header">
          <span className="mp-eyebrow">✦ EXCLUSIVE PLANS ✦</span>
          <h2 className="mp-title">
            Prive <span className="mp-gold">Membership</span>
          </h2>
          <p className="mp-sub">
            One monthly fee. Luxury beauty — delivered to your door.
          </p>
        </div>

        {/* Cards */}
        <div className="mp-cards">
          {loading ? (
            [1, 2].map((i) => (
              <div key={i} className="mp-card mp-skeleton">
                <div className="mp-sk-line mp-sk-short" />
                <div className="mp-sk-line mp-sk-long" />
                <div className="mp-sk-price" />
                <div className="mp-sk-line" />
                <div className="mp-sk-btn" />
              </div>
            ))
          ) : plans.length === 0 ? null : (
            plans.map((plan, i) => {
              const savings =
                (plan.retailValue || 0) - plan.monthlyFee;

              return (
                <div
                  key={plan._id}
                  className={`mp-card ${getCardClass(plan.tier)}`}
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  <div className="mp-glow-bar" />

                  {plan.tier === 2 && (
                    <span className="mp-popular">
                      MOST POPULAR
                    </span>
                  )}

                  <p className="mp-tier-label">
                    TIER {plan.tier}
                  </p>

                  <h3 className="mp-plan-name">
                    {plan.name}
                  </h3>

                  <div className="mp-price-row">
                    <span className="mp-currency">
                      AED
                    </span>
                    <span className="mp-amount">
                      {plan.monthlyFee}
                    </span>
                    <span className="mp-per">/mo</span>
                  </div>

                  <div className="mp-pills">
                    {savings > 0 && (
                      <span className="mp-pill mp-pill-green">
                        Save AED {savings}
                      </span>
                    )}
                    {plan.additionalDiscount > 0 && (
                      <span className="mp-pill mp-pill-tier">
                        +{plan.additionalDiscount}% off extras
                      </span>
                    )}
                  </div>

                  {plan.subOptions?.length > 0 && (
                    <p className="mp-hint">
                      {plan.subOptions.length} package
                      options included
                    </p>
                  )}

                  <button
                    className="mp-btn"
                    onClick={() =>
                      navigate(`/membership?plan=${plan._id}`)
                    }
                  >
                    View Plan Details
                    <span className="mp-arrow">→</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {!loading && plans.length > 0 && (
          <div className="mp-bottom">
            <button
              className="mp-all-btn"
              onClick={() => navigate("/membership")}
            >
              Compare All Plans & Enroll
              <span className="mp-arrow">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MembershipPreview;