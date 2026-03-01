import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/api";
import { toastSuccess, toastError } from "../../utils/alert";

/* ── Helpers ─────────────────────────────── */
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const fmtShort = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short" }) : "—";
const toInput  = (d) => d ? new Date(d).toISOString().split("T")[0] : "";
const today    = () => new Date().toISOString().split("T")[0];

const statusCls = (s, daysLeft) => {
  if (s === "cancelled") return "bg-gray-700 text-gray-400";
  if (s === "paused")    return "bg-blue-500/20 text-blue-400";
  if (s === "expired" || daysLeft < 0) return "bg-red-500/20 text-red-400";
  if (daysLeft <= 7)     return "bg-orange-500/20 text-orange-400";
  return "bg-green-500/20 text-green-400";
};

const statusLabel = (s, daysLeft) => {
  if (s === "cancelled") return "Cancelled";
  if (s === "paused")    return "Paused";
  if (s === "expired" || daysLeft < 0) return "Expired";
  if (daysLeft <= 7)     return `⚠️ ${daysLeft}d left`;
  return `Active · ${daysLeft}d`;
};

const paymentCls = (s) => ({
  paid:    "text-green-400",
  partial: "text-yellow-400",
  pending: "text-orange-400",
  overdue: "text-red-400",
})[s] || "text-gray-400";

const TIER_COLORS = {
  1: { bg:"bg-amber-500/10", border:"border-amber-500/30", text:"text-amber-400", badge:"bg-amber-500" },
  2: { bg:"bg-purple-500/10", border:"border-purple-500/30", text:"text-purple-400", badge:"bg-purple-500" },
  3: { bg:"bg-blue-500/10", border:"border-blue-500/30", text:"text-blue-400", badge:"bg-blue-500" },
};
const tierColor = (t) => TIER_COLORS[t] || TIER_COLORS[1];

/* ════════════════════════════════════════════
   PLAN FORM MODAL
════════════════════════════════════════════ */
const PlanFormModal = ({ plan, onClose, onSaved }) => {
  const isEdit = !!plan;
  const [form, setForm] = useState(plan ? { ...plan } : {
    name:"", tier:1, monthlyFee:"", retailValue:"",
    additionalDiscount:10, description:"", includedServices:"",
    subOptions:[], color:"#f59e0b", isActive:true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const addSub = () => setForm(p=>({...p, subOptions:[...p.subOptions, {label:"",title:"",services:"",value:""}]}));
  const setSub = (i,k,v) => setForm(p=>{ const s=[...p.subOptions]; s[i]={...s[i],[k]:v}; return {...p,subOptions:s}; });
  const delSub = (i) => setForm(p=>({...p, subOptions:p.subOptions.filter((_,j)=>j!==i)}));

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (isEdit) await api.put(`/membership/plans/${plan._id}`, form);
      else        await api.post("/membership/plans", form);
      toastSuccess(isEdit?"Plan updated":"Plan created");
      onSaved(); onClose();
    } catch(err){ toastError(err.response?.data?.message||"Failed"); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3">
      <div className="bg-gray-900 border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h3 className="text-amber-400 font-bold text-base">{isEdit?"Edit Plan":"Add Membership Plan"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition">✕</button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Plan Name *</label>
              <input required value={form.name} onChange={e=>set("name",e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none"
                placeholder="Tier 1 – Privé Monthly Groom & Glow" />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Tier #</label>
              <input type="number" min="1" required value={form.tier} onChange={e=>set("tier",Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Monthly Fee (AED) *</label>
              <input type="number" required value={form.monthlyFee} onChange={e=>set("monthlyFee",e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none" placeholder="399" />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Retail Value (AED)</label>
              <input type="number" value={form.retailValue} onChange={e=>set("retailValue",e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none" placeholder="500" />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Extra Discount (%)</label>
              <input type="number" value={form.additionalDiscount} onChange={e=>set("additionalDiscount",e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none" placeholder="10" />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Description</label>
            <input value={form.description} onChange={e=>set("description",e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none" placeholder="Short plan description..." />
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Included Services (Main)</label>
            <textarea value={form.includedServices} onChange={e=>set("includedServices",e.target.value)} rows={3}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none resize-none"
              placeholder="Hair (Cut or Spa) + Facial + Half Leg or Full Arm Wax..." />
          </div>

          {/* Sub-options (a, b, c...) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] text-gray-400 font-medium">Sub-Options (a, b, c...)</label>
              <button type="button" onClick={addSub} className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-lg hover:bg-amber-500/30 transition">+ Add Option</button>
            </div>
            {form.subOptions?.map((sub,i)=>(
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-3 mb-2 space-y-2">
                <div className="flex gap-2">
                  <input value={sub.label} onChange={e=>setSub(i,"label",e.target.value)}
                    className="w-12 px-2 py-1.5 bg-gray-700 border border-gray-600 text-white text-xs rounded-lg focus:border-amber-500 outline-none" placeholder="a" />
                  <input value={sub.title} onChange={e=>setSub(i,"title",e.target.value)}
                    className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 text-white text-xs rounded-lg focus:border-amber-500 outline-none" placeholder="Package name" />
                  <input type="number" value={sub.value} onChange={e=>setSub(i,"value",e.target.value)}
                    className="w-24 px-2 py-1.5 bg-gray-700 border border-gray-600 text-white text-xs rounded-lg focus:border-amber-500 outline-none" placeholder="AED value" />
                  <button type="button" onClick={()=>delSub(i)} className="text-red-400 hover:text-red-300 text-sm px-1">✕</button>
                </div>
                <textarea value={sub.services} onChange={e=>setSub(i,"services",e.target.value)} rows={2}
                  className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-white text-xs rounded-lg focus:border-amber-500 outline-none resize-none"
                  placeholder="Services in this option..." />
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded-xl transition disabled:opacity-50">
              {saving?"Saving...":isEdit?"Update Plan":"Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MEMBER FORM MODAL
════════════════════════════════════════════ */
const MemberFormModal = ({ member, plans, onClose, onSaved }) => {
  const isEdit = !!member;
  const [form, setForm] = useState(isEdit ? {
    customerName: member.customerName,
    phone: member.phone||"", email: member.email||"",
    emiratesId: member.emiratesId||"",
    planId: member.plan?._id || member.plan,
    subOptionLabel: member.subOptionLabel||"",
    startDate: toInput(member.startDate),
    paidAmount: member.paidAmount||"",
    paymentMethod: member.paymentMethod||"cash",
    autoRenew: member.autoRenew||false,
    notes: member.notes||"",
    status: member.status,
  } : {
    customerName:"", phone:"", email:"", emiratesId:"",
    planId: plans[0]?._id||"", subOptionLabel:"",
    startDate: today(), paidAmount:"",
    paymentMethod:"cash", autoRenew:false, notes:"", status:"active",
  });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const selectedPlan = plans.find(p=>p._id===form.planId);
  // Calculate end date preview
  const endPreview = form.startDate ? (() => {
    const d = new Date(form.startDate); d.setMonth(d.getMonth()+1); return fmtDate(d);
  })() : "—";

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (isEdit) await api.put(`/membership/${member._id}`, form);
      else        await api.post("/membership", form);
      toastSuccess(isEdit?"Member updated":`${form.customerName} enrolled!`);
      onSaved(); onClose();
    } catch(err){ toastError(err.response?.data?.message||"Failed"); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3">
      <div className="bg-gray-900 border border-green-500/30 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h3 className="text-green-400 font-bold text-base">{isEdit?"Edit Member":"Enroll New Member"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition">✕</button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          {/* Customer Info */}
          <div className="space-y-3">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Customer Info</p>
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Full Name *</label>
              <input required value={form.customerName} onChange={e=>set("customerName",e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-green-500 outline-none" placeholder="Customer name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Phone</label>
                <input value={form.phone} onChange={e=>set("phone",e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-green-500 outline-none" placeholder="+971..." />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e=>set("email",e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-green-500 outline-none" placeholder="email@..." />
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="space-y-3">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Membership Plan</p>
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Plan *</label>
              <select value={form.planId} onChange={e=>set("planId",e.target.value)} required
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-green-500 outline-none">
                <option value="">— Select Plan —</option>
                {plans.map(p=>(
                  <option key={p._id} value={p._id}>
                    Tier {p.tier} — {p.name} (AED {p.monthlyFee}/mo)
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-options if plan has them */}
            {selectedPlan?.subOptions?.length > 0 && (
              <div>
                <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Choose Package Option</label>
                <div className="space-y-1.5">
                  {selectedPlan.subOptions.map(opt=>(
                    <label key={opt.label} className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${form.subOptionLabel===opt.label?"border-green-500/50 bg-green-900/10":"border-gray-700 hover:border-gray-600"}`}>
                      <input type="radio" name="subOption" value={opt.label} checked={form.subOptionLabel===opt.label}
                        onChange={e=>set("subOptionLabel",e.target.value)} className="mt-0.5 accent-green-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold">{opt.label}. {opt.title}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5 line-clamp-2">{opt.services}</p>
                      </div>
                      {opt.value > 0 && <span className="text-green-400 text-[10px] font-bold shrink-0">AED {opt.value}</span>}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Start Date *</label>
              <input type="date" required value={form.startDate} onChange={e=>set("startDate",e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-green-500 outline-none" />
              {form.startDate && (
                <p className="text-gray-500 text-[10px] mt-1.5">📅 Membership ends: <span className="text-green-400 font-semibold">{endPreview}</span></p>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-3">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Payment</p>
            {selectedPlan && (
              <div className="bg-gray-800 rounded-xl p-3 flex justify-between items-center">
                <span className="text-gray-400 text-xs">Monthly Fee</span>
                <span className="text-amber-400 font-bold">AED {selectedPlan.monthlyFee}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Amount Paid (AED)</label>
                <input type="number" min="0" value={form.paidAmount} onChange={e=>set("paidAmount",e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-green-500 outline-none"
                  placeholder={selectedPlan?.monthlyFee||"0"} />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Payment Method</label>
                <select value={form.paymentMethod} onChange={e=>set("paymentMethod",e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-green-500 outline-none">
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Card</option>
                  <option value="bank">🏦 Bank Transfer</option>
                  <option value="online">📱 Online</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={2}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-green-500 outline-none resize-none"
              placeholder="Any notes about this member..." />
          </div>

          {isEdit && (
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Status</label>
              <div className="flex gap-2">
                {["active","expired","cancelled","paused"].map(s=>(
                  <button key={s} type="button" onClick={()=>set("status",s)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition capitalize ${form.status===s?"bg-green-600 text-white":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50">
              {saving?"Saving...":isEdit?"Save Changes":"Enroll Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   RENEW MODAL
════════════════════════════════════════════ */
const RenewModal = ({ member, onClose, onSaved }) => {
  const [form, setForm] = useState({ paidAmount: member.monthlyFee||"", paymentMethod:"cash", note:"" });
  const [saving, setSaving] = useState(false);

  const newStart = new Date() > new Date(member.endDate) ? new Date() : new Date(member.endDate);
  const newEnd   = new Date(newStart); newEnd.setMonth(newEnd.getMonth()+1);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post(`/membership/${member._id}/renew`, form);
      toastSuccess("Membership renewed!"); onSaved(); onClose();
    } catch(err){ toastError(err.response?.data?.message||"Failed"); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3">
      <div className="bg-gray-900 border border-blue-500/30 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800">
          <h3 className="text-blue-400 font-bold">🔄 Renew Membership</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800">✕</button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="bg-gray-800 rounded-xl p-3 space-y-1">
            <p className="text-white font-semibold text-sm">{member.customerName}</p>
            <p className="text-gray-400 text-xs">{member.planName}</p>
            <div className="flex gap-4 mt-2 pt-2 border-t border-gray-700">
              <div><p className="text-[9px] text-gray-500">New Start</p><p className="text-blue-400 text-xs font-semibold">{fmtDate(newStart)}</p></div>
              <div><p className="text-[9px] text-gray-500">New End</p><p className="text-green-400 text-xs font-semibold">{fmtDate(newEnd)}</p></div>
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Amount (AED) *</label>
            <input type="number" required min="0" value={form.paidAmount} onChange={e=>setForm(p=>({...p,paidAmount:e.target.value}))}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Payment Method</label>
            <select value={form.paymentMethod} onChange={e=>setForm(p=>({...p,paymentMethod:e.target.value}))}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-blue-500 outline-none">
              <option value="cash">💵 Cash</option>
              <option value="card">💳 Card</option>
              <option value="bank">🏦 Bank Transfer</option>
              <option value="online">📱 Online</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Note</label>
            <input value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-blue-500 outline-none" placeholder="Optional note..." />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-800 text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-700 transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50">
              {saving?"Renewing...":"Confirm Renew"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MEMBER DETAIL DRAWER
════════════════════════════════════════════ */
const MemberDetail = ({ member, onClose, onEdit, onRenew, onDelete }) => {
  const tc = tierColor(member.planTier || member.plan?.tier);
  const daysLeft = member.daysLeft;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-3">
      <div className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${tc.bg} border ${tc.border} flex items-center justify-center`}>
              <span className={`font-bold ${tc.text}`}>{member.customerName[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-white font-bold">{member.customerName}</p>
              <p className="text-gray-400 text-xs">{member.planName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status banner */}
          <div className={`rounded-xl p-3 flex justify-between items-center ${statusCls(member.status, daysLeft)} bg-opacity-20`}>
            <div>
              <p className="font-bold text-sm">{statusLabel(member.status, daysLeft)}</p>
              <p className="text-xs opacity-70 mt-0.5">{fmtDate(member.startDate)} → {fmtDate(member.endDate)}</p>
            </div>
            {(member.status === "expired" || daysLeft <= 7) && (
              <button onClick={onRenew} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition">
                🔄 Renew
              </button>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:"Phone",    val:member.phone||"—" },
              { label:"Email",    val:member.email||"—" },
              { label:"Plan Tier",val:`Tier ${member.planTier||"—"}` },
              { label:"Option",   val:member.subOptionLabel ? `Option ${member.subOptionLabel}` : "—" },
              { label:"Monthly Fee", val:`AED ${member.monthlyFee}` },
              { label:"Paid",      val:<span className={paymentCls(member.paymentStatus)}>AED {member.paidAmount} ({member.paymentStatus})</span> },
              { label:"Payment",   val:member.paymentMethod },
              { label:"Emirates ID",val:member.emiratesId||"—" },
            ].map(({label,val})=>(
              <div key={label} className="bg-gray-800 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
                <p className="text-white text-xs font-semibold">{val}</p>
              </div>
            ))}
          </div>

          {/* Notes */}
          {member.notes && (
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-[10px] text-gray-500 mb-1">Notes</p>
              <p className="text-gray-200 text-xs">{member.notes}</p>
            </div>
          )}

          {/* Renewal history */}
          {member.renewals?.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Renewal History ({member.renewals.length})</p>
              <div className="space-y-2">
                {member.renewals.map((r,i)=>(
                  <div key={i} className="bg-gray-800 rounded-xl p-2.5 flex justify-between items-center">
                    <div>
                      <p className="text-gray-300 text-xs">{fmtShort(r.newStartDate)} → {fmtShort(r.newEndDate)}</p>
                      {r.note && <p className="text-gray-500 text-[10px]">{r.note}</p>}
                    </div>
                    <p className="text-green-400 text-xs font-bold">AED {r.paidAmount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onRenew} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition">🔄 Renew</button>
            <button onClick={onEdit}  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded-xl transition">✏️ Edit</button>
            <button onClick={onDelete} className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm font-bold rounded-xl transition">🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   PLANS VIEW
════════════════════════════════════════════ */
const PlansView = ({ onBack }) => {
  const [plans,     setPlans]     = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [editPlan,  setEditPlan]  = useState(null);
  const [expanded,  setExpanded]  = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get("/membership/plans"); setPlans(res.data.data||[]); }
    catch { toastError("Failed to load plans"); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const deletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try { await api.delete(`/membership/plans/${id}`); toastSuccess("Plan deleted"); fetchPlans(); }
    catch(err) { toastError(err.response?.data?.message||"Failed"); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl transition text-lg">‹</button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Membership Plans</h2>
          <p className="text-gray-400 text-xs">{plans.length} plans configured</p>
        </div>
        <button onClick={()=>{setEditPlan(null);setShowForm(true)}} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded-xl transition">+ Add Plan</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">💎</p>
          <p className="text-gray-400 text-sm mb-4">No plans yet. Create your first membership plan.</p>
          <button onClick={()=>setShowForm(true)} className="px-6 py-2.5 bg-amber-500 text-black font-bold rounded-xl">+ Create Plan</button>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map(plan => {
            const tc = tierColor(plan.tier);
            const isEx = expanded === plan._id;
            return (
              <div key={plan._id} className={`${tc.bg} border ${tc.border} rounded-2xl overflow-hidden`}>
                <div onClick={()=>setExpanded(isEx?null:plan._id)} className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition">
                  <div className={`w-10 h-10 rounded-xl ${tc.badge} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-sm">{plan.tier}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${tc.text}`}>{plan.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{plan.description || `${plan.subOptions?.length||0} packages • ${plan.additionalDiscount}% extra discount`}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-bold">AED {plan.monthlyFee}<span className="text-gray-500 text-[10px] font-normal">/mo</span></p>
                    <p className="text-gray-500 text-[10px]">Retail AED {plan.retailValue}</p>
                  </div>
                  <span className={`text-gray-400 text-lg transition-transform ml-1 ${isEx?"rotate-90":""}`}>›</span>
                </div>

                {isEx && (
                  <div className="border-t border-white/10 p-4 space-y-3">
                    {plan.includedServices && (
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1.5">Main Included Services</p>
                        <p className="text-gray-300 text-xs leading-relaxed">{plan.includedServices}</p>
                      </div>
                    )}
                    {plan.subOptions?.length > 0 && (
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1.5">Package Options</p>
                        <div className="space-y-2">
                          {plan.subOptions.map(opt=>(
                            <div key={opt.label} className="bg-black/20 rounded-xl p-3">
                              <div className="flex justify-between items-center mb-1">
                                <p className={`text-xs font-bold ${tc.text}`}>{opt.label}. {opt.title}</p>
                                {opt.value > 0 && <span className="text-[10px] text-gray-400">AED {opt.value}</span>}
                              </div>
                              <p className="text-gray-400 text-[10px] leading-relaxed">{opt.services}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button onClick={e=>{e.stopPropagation();setEditPlan(plan);setShowForm(true)}}
                        className="flex-1 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold rounded-xl transition">✏️ Edit</button>
                      <button onClick={e=>{e.stopPropagation();deletePlan(plan._id)}}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-bold rounded-xl transition">🗑 Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && <PlanFormModal plan={editPlan} onClose={()=>{setShowForm(false);setEditPlan(null)}} onSaved={fetchPlans} />}
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN MEMBERSHIP TAB
════════════════════════════════════════════ */
const MembershipTab = () => {
  const [view, setView] = useState("members"); // members | plans

  const [members,    setMembers]    = useState([]);
  const [plans,      setPlans]      = useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(false);

  // Filters
  const [search,       setSearch]      = useState("");
  const [filterStatus, setFilterStatus]= useState("");
  const [filterPlan,   setFilterPlan]  = useState("");
  const [filterExpiry, setFilterExpiry]= useState(""); // "7"|"30"|""

  // Modals
  const [showAddModal,  setShowAddModal]  = useState(false);
  const [editMember,    setEditMember]    = useState(null);
  const [renewMember,   setRenewMember]   = useState(null);
  const [detailMember,  setDetailMember]  = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)       params.set("search",       search);
      if (filterStatus) params.set("status",       filterStatus);
      if (filterPlan)   params.set("plan",         filterPlan);
      if (filterExpiry) params.set("expiringSoon", filterExpiry);

      const [mRes, pRes, sRes] = await Promise.all([
        api.get(`/membership?${params}`),
        api.get("/membership/plans"),
        api.get("/membership/stats"),
      ]);
      setMembers(mRes.data.data || []);
      setPlans(pRes.data.data   || []);
      setStats(sRes.data.data   || null);
    } catch { toastError("Failed to load"); }
    setLoading(false);
  }, [search, filterStatus, filterPlan, filterExpiry]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const deleteMember = async (id) => {
    if (!window.confirm("Remove this member?")) return;
    try { await api.delete(`/membership/${id}`); toastSuccess("Member removed"); fetchData(); setDetailMember(null); }
    catch { toastError("Failed"); }
  };

  if (view === "plans") return <PlansView onBack={()=>setView("members")} />;

  // Expiry warning ring color
  const expiryAlerts = stats ? (stats.expiring7 || 0) : 0;

  return (
    <div>
      {/* ── Stats Bar ── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Active</p>
          </div>
          <div className={`${expiryAlerts>0?"bg-orange-900/20 border-orange-500/30 animate-pulse":"bg-gray-800 border-gray-700"} border rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${expiryAlerts>0?"text-orange-400":"text-gray-400"}`}>{stats.expiring7}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">⚠️ Expiring 7d</p>
          </div>
          <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{stats.expired}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Expired</p>
          </div>
          <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-amber-400">AED {(stats.monthlyRevenue||0).toLocaleString()}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">This Month</p>
          </div>
        </div>
      )}

      {/* Per-plan breakdown */}
      {stats?.perPlan?.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {stats.perPlan.map(p=>{
            const tc = tierColor(p.tier);
            return (
              <div key={p._id} className={`shrink-0 ${tc.bg} border ${tc.border} rounded-xl px-3 py-2 flex items-center gap-2`}>
                <span className={`text-xs font-bold ${tc.text}`}>T{p.tier}</span>
                <span className="text-white text-xs font-semibold">{p.count} members</span>
                <span className="text-gray-500 text-[10px]">{p._id?.split("–")[0]?.trim()}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Action row ── */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={()=>setShowAddModal(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition">+ Enroll Member</button>
        <button onClick={()=>setView("plans")} className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-bold rounded-xl transition">💎 Manage Plans</button>
        {expiryAlerts > 0 && (
          <button onClick={()=>setFilterExpiry("7")}
            className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-bold rounded-xl transition animate-pulse">
            ⚠️ {expiryAlerts} expiring soon
          </button>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="relative flex-1 min-w-36">
          <input type="text" placeholder="🔍 Name, phone, email..." value={search}
            onChange={e=>setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none placeholder-gray-500" />
          {search && <button onClick={()=>setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">✕</button>}
        </div>
        <select value={filterPlan} onChange={e=>setFilterPlan(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl outline-none">
          <option value="">All Plans</option>
          {plans.map(p=><option key={p._id} value={p._id}>Tier {p.tier} — {p.name}</option>)}
        </select>
      </div>

      {/* Status + expiry filters */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {[
          {v:"",         l:"All"},
          {v:"active",   l:"✅ Active"},
          {v:"expired",  l:"❌ Expired"},
          {v:"cancelled",l:"🚫 Cancelled"},
        ].map(({v,l})=>(
          <button key={v} onClick={()=>setFilterStatus(v)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition ${filterStatus===v?"bg-amber-500 text-black":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>{l}</button>
        ))}
        <div className="w-px bg-gray-700 mx-1" />
        {[
          {v:"7",  l:"⚠️ Expiring 7d"},
          {v:"30", l:"📅 Expiring 30d"},
        ].map(({v,l})=>(
          <button key={v} onClick={()=>setFilterExpiry(filterExpiry===v?"":v)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition ${filterExpiry===v?"bg-orange-500 text-black":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>{l}</button>
        ))}
        {(filterExpiry||filterStatus||search||filterPlan) && (
          <button onClick={()=>{setSearch("");setFilterStatus("");setFilterPlan("");setFilterExpiry("");}}
            className="px-3 py-1.5 text-[11px] font-bold rounded-xl bg-gray-700 text-gray-300 hover:bg-gray-600 transition">✕ Clear</button>
        )}
      </div>

      <p className="text-gray-500 text-xs mb-3">{members.length} member{members.length!==1?"s":""}</p>

      {/* ── Member List ── */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : members.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">👤</p>
          <p className="text-gray-400 text-sm">No members found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map(m => {
            const tc = tierColor(m.planTier || m.plan?.tier);
            const daysLeft = m.daysLeft;
            const isExpired = m.isExpired;
            const isSoon = m.isExpiringSoon;

            return (
              <div key={m._id}
                onClick={()=>setDetailMember(m)}
                className={`bg-gray-900 border rounded-xl p-3 cursor-pointer hover:bg-gray-800/80 transition flex items-center gap-3 ${
                  isExpired ? "border-red-500/30" : isSoon ? "border-orange-500/40" : "border-gray-700/50"
                }`}>

                {/* Tier badge */}
                <div className={`w-10 h-10 rounded-xl ${tc.bg} border ${tc.border} flex items-center justify-center shrink-0`}>
                  <span className={`font-bold text-sm ${tc.text}`}>T{m.planTier || m.plan?.tier}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white text-sm font-semibold truncate">{m.customerName}</p>
                    {isSoon && !isExpired && <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full font-bold">⚠️ Expiring</span>}
                  </div>
                  <p className="text-gray-400 text-[10px] mt-0.5 truncate">{m.planName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-500 text-[10px]">📅 {fmtShort(m.startDate)} → {fmtShort(m.endDate)}</p>
                    {m.phone && <p className="text-gray-600 text-[10px]">• {m.phone}</p>}
                  </div>
                </div>

                {/* Right: status + amount */}
                <div className="text-right shrink-0">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-xl ${statusCls(m.status, daysLeft)}`}>
                    {statusLabel(m.status, daysLeft)}
                  </span>
                  <p className={`text-[10px] mt-1 ${paymentCls(m.paymentStatus)}`}>AED {m.monthlyFee}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modals ── */}
      {showAddModal && (
        <MemberFormModal plans={plans} onClose={()=>setShowAddModal(false)} onSaved={fetchData} />
      )}
      {editMember && (
        <MemberFormModal member={editMember} plans={plans}
          onClose={()=>setEditMember(null)} onSaved={()=>{fetchData();setDetailMember(null);}} />
      )}
      {renewMember && (
        <RenewModal member={renewMember}
          onClose={()=>setRenewMember(null)}
          onSaved={()=>{fetchData();setDetailMember(null);}} />
      )}
      {detailMember && (
        <MemberDetail
          member={detailMember}
          onClose={()=>setDetailMember(null)}
          onEdit={()=>{setEditMember(detailMember);setDetailMember(null);}}
          onRenew={()=>{setRenewMember(detailMember);setDetailMember(null);}}
          onDelete={()=>deleteMember(detailMember._id)}
        />
      )}
    </div>
  );
};

export default MembershipTab;