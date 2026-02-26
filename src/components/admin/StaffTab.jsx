import React, { useEffect, useState, useCallback } from "react";
import { useInventory } from "../../context/InventoryContext";
import { useAdmin }     from "../../context/AdminContext";
import api              from "../../api/api";
import { toastSuccess, toastError } from "../../utils/alert";

/* ── Constants ─────────────────────────────── */
const SPECIALIZATIONS = ["Hair","Skin","Nails","Waxing","Massage","Grooming","Makeup"];
const SOURCES = [
  { value: "call",     label: "📞 Call"     },
  { value: "whatsapp", label: "💬 WhatsApp" },
  { value: "walkin",   label: "🚶 Walk-in"  },
  { value: "manual",   label: "📝 Other"    },
];
const STATUS_OPTIONS = [
  { val: "present",  label: "Present",  short: "P",  cls: "bg-green-500 text-white",   ring: "ring-green-500"  },
  { val: "absent",   label: "Absent",   short: "A",  cls: "bg-red-500 text-white",     ring: "ring-red-500"    },
  { val: "half-day", label: "Half Day", short: "½",  cls: "bg-yellow-500 text-black",  ring: "ring-yellow-500" },
  { val: "leave",    label: "Leave",    short: "L",  cls: "bg-blue-500 text-white",    ring: "ring-blue-500"   },
];

const todayStr     = () => new Date().toISOString().split("T")[0];
const currentMonth = () => new Date().toISOString().slice(0, 7);
const fmtDate      = (d) => new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short" });

const statusCls = (s) => ({
  present:      "bg-green-500/20 text-green-400",
  absent:       "bg-red-500/20 text-red-400",
  "half-day":   "bg-yellow-500/20 text-yellow-400",
  leave:        "bg-blue-500/20 text-blue-400",
  "not-marked": "bg-gray-700 text-gray-500",
})[s] || "bg-gray-700 text-gray-500";

const sourceLabel = (s) => ({ website:"🌐", call:"📞", whatsapp:"💬", walkin:"🚶", manual:"📝" })[s] || "📝";

/* ════════════════════════════════════════════
   STAFF FORM MODAL
════════════════════════════════════════════ */
const StaffFormModal = ({ staffMember, onClose }) => {
  const { addStaff, updateStaff } = useInventory();
  const isEdit = !!staffMember;
  const [form, setForm] = useState(isEdit ? {
    name: staffMember.name||"", phone: staffMember.phone||"",
    specialization: staffMember.specialization||[],
    servicesFor: staffMember.servicesFor||"both", notes: staffMember.notes||"",
  } : { name:"", phone:"", specialization:[], servicesFor:"both", notes:"" });
  const [saving, setSaving] = useState(false);

  const toggleSpec = (spec) => setForm(p => ({
    ...p, specialization: p.specialization.includes(spec)
      ? p.specialization.filter(s => s !== spec)
      : [...p.specialization, spec],
  }));

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { isEdit ? await updateStaff(staffMember._id, form) : await addStaff(form); onClose(); }
    catch(_){} setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3">
      <div className="bg-gray-900 border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800">
          <h3 className="text-amber-400 font-bold text-base">{isEdit?"Edit Staff":"Add Staff Member"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition text-xl">✕</button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Name *</label>
              <input required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none transition" placeholder="Full name" />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Phone</label>
              <input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none transition" placeholder="+971..." />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Services For</label>
            <div className="flex gap-2">
              {["both","women","men"].map(g=>(
                <button key={g} type="button" onClick={()=>setForm(p=>({...p,servicesFor:g}))}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition capitalize ${form.servicesFor===g?"bg-amber-500 text-black":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>{g}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Specialization</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map(spec=>(
                <button key={spec} type="button" onClick={()=>toggleSpec(spec)}
                  className={`px-3 py-1.5 text-xs rounded-full transition font-medium ${form.specialization.includes(spec)?"bg-amber-500 text-black":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>{spec}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={2}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none resize-none transition" placeholder="Experience, skills..." />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded-xl transition disabled:opacity-50">
              {saving?"Saving...":isEdit?"Update":"Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MANUAL BOOKING MODAL
════════════════════════════════════════════ */
const ManualBookingModal = ({ allStaff, defaultStaff, onClose, onSaved }) => {
  const [form, setForm] = useState({
    customerName:"", phone:"", date:todayStr(), time:"",
    servicesText:"", totalAmount:"", staffId:defaultStaff?._id||"",
    source:"call", notes:"",
  });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post("/staff/manual-booking", {...form, totalAmount:Number(form.totalAmount)});
      toastSuccess("Booking added!"); onSaved(); onClose();
    } catch(err){ toastError(err.response?.data?.message||"Failed"); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3">
      <div className="bg-gray-900 border border-purple-500/30 rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800">
          <div>
            <h3 className="text-purple-400 font-bold text-base">+ Manual Booking</h3>
            <p className="text-gray-500 text-xs mt-0.5">Call / WhatsApp / Walk-in</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition text-xl">✕</button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Source</label>
            <div className="grid grid-cols-4 gap-1.5">
              {SOURCES.map(s=>(
                <button key={s.value} type="button" onClick={()=>set("source",s.value)}
                  className={`py-2 text-xs font-bold rounded-xl transition ${form.source===s.value?"bg-purple-600 text-white":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>{s.label}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Customer Name *</label>
              <input required value={form.customerName} onChange={e=>set("customerName",e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-purple-500 outline-none transition" placeholder="Name" />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Phone</label>
              <input value={form.phone} onChange={e=>set("phone",e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-purple-500 outline-none transition" placeholder="+971..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Date *</label>
              <input required type="date" value={form.date} onChange={e=>set("date",e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-purple-500 outline-none transition" />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Time *</label>
              <input required type="time" value={form.time} onChange={e=>set("time",e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-purple-500 outline-none transition" />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Services Done *</label>
            <textarea required value={form.servicesText} onChange={e=>set("servicesText",e.target.value)} rows={2}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-purple-500 outline-none resize-none transition"
              placeholder="e.g. Hair Cut + Color, Waxing..." />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Amount (AED) *</label>
            <input required type="number" min="0" value={form.totalAmount} onChange={e=>set("totalAmount",e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-purple-500 outline-none transition" placeholder="0" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Staff Member</label>
            <select value={form.staffId} onChange={e=>set("staffId",e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-purple-500 outline-none transition">
              <option value="">— Select Staff —</option>
              {allStaff.map(s=>(
                <option key={s._id} value={s._id}>{s.name}{s.specialization?.length?` (${s.specialization.join(", ")})`:""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">Notes</label>
            <input value={form.notes} onChange={e=>set("notes",e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-purple-500 outline-none transition" placeholder="Optional..." />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50">
              {saving?"Adding...":"Add Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   BULK ATTENDANCE VIEW
   One screen — all staff, tap status buttons
════════════════════════════════════════════ */
const AttendanceView = ({ onBack }) => {
  const [date, setDate]         = useState(todayStr());
  const [records, setRecords]   = useState([]); // [{staff, attendance, status}]
  const [pending, setPending]   = useState({}); // staffId → chosen status
  const [loading, setLoading]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [saved,   setSaved]     = useState({});  // staffId → true if saved today

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/staff/attendance?date=${date}`);
      const data = res.data.data || [];
      setRecords(data);
      // Pre-fill pending from existing attendance
      const pre = {};
      const sv  = {};
      data.forEach(r => {
        if (r.attendance) { pre[r.staff._id] = r.status; sv[r.staff._id] = true; }
      });
      setPending(pre);
      setSaved(sv);
    } catch { toastError("Failed to load"); }
    setLoading(false);
  }, [date]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const markOne = (staffId, status) => setPending(p => ({ ...p, [staffId]: status }));

  // Save all changed
  const saveAll = async () => {
    const toSave = records.filter(r => pending[r.staff._id]);
    if (!toSave.length) { toastError("Mark at least one staff"); return; }
    setSaving(true);
    let count = 0;
    for (const r of toSave) {
      const status = pending[r.staff._id];
      if (!status) continue;
      try {
        await api.post("/staff/attendance", { staffId: r.staff._id, date, status });
        count++;
      } catch(_){}
    }
    toastSuccess(`${count} attendance records saved`);
    setSaving(false);
    fetchData();
  };

  // Mark all at once
  const markAll = (status) => {
    const next = {};
    records.forEach(r => { next[r.staff._id] = status; });
    setPending(next);
  };

  const counts = {
    present:    Object.values(pending).filter(s=>s==="present").length,
    absent:     Object.values(pending).filter(s=>s==="absent").length,
    halfDay:    Object.values(pending).filter(s=>s==="half-day").length,
    leave:      Object.values(pending).filter(s=>s==="leave").length,
    unmarked:   records.filter(r=>!pending[r.staff._id]).length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl transition text-lg">‹</button>
        <div>
          <h2 className="text-white font-bold text-base">Attendance</h2>
          <p className="text-gray-400 text-xs">{records.length} staff members</p>
        </div>
      </div>

      {/* Date picker */}
      <div className="flex items-center gap-2 mb-4">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl outline-none focus:border-amber-500 transition" />
        <button onClick={() => setDate(todayStr())} className="px-3 py-2 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-xl hover:bg-amber-500/30 transition">Today</button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {[
          { label:"Present",  val:counts.present,  cls:"bg-green-500/20 text-green-400" },
          { label:"Absent",   val:counts.absent,   cls:"bg-red-500/20 text-red-400"     },
          { label:"Half Day", val:counts.halfDay,  cls:"bg-yellow-500/20 text-yellow-400"},
          { label:"Leave",    val:counts.leave,    cls:"bg-blue-500/20 text-blue-400"   },
          { label:"Unmarked", val:counts.unmarked, cls:"bg-gray-700 text-gray-400"      },
        ].map(({label,val,cls})=>(
          <div key={label} className={`${cls} rounded-xl p-2 text-center`}>
            <p className="text-lg font-bold">{val}</p>
            <p className="text-[9px] font-semibold opacity-80 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Mark All shortcuts */}
      <div className="flex items-center gap-2 mb-4">
        <p className="text-gray-500 text-xs shrink-0">Mark All:</p>
        {STATUS_OPTIONS.map(s=>(
          <button key={s.val} onClick={()=>markAll(s.val)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${s.cls} hover:opacity-80`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Staff list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {records.map(({staff, attendance}) => {
            const chosen = pending[staff._id];
            return (
              <div key={staff._id} className="bg-gray-900 border border-gray-700/50 rounded-xl p-3 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <span className="text-amber-400 font-bold text-sm">{staff.name[0]?.toUpperCase()}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{staff.name}</p>
                  <p className="text-gray-500 text-[10px] truncate">{staff.specialization?.join(", ") || "General"}</p>
                </div>

                {/* Status buttons — 4 small chips */}
                <div className="flex gap-1 shrink-0">
                  {STATUS_OPTIONS.map(opt=>(
                    <button key={opt.val} onClick={()=>markOne(staff._id, chosen===opt.val ? undefined : opt.val)}
                      title={opt.label}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition border-2 ${
                        chosen===opt.val
                          ? `${opt.cls} border-white/30 scale-105 shadow-lg`
                          : "bg-gray-800 text-gray-500 border-transparent hover:bg-gray-700"
                      }`}>
                      {opt.short}
                    </button>
                  ))}
                </div>

                {/* Saved indicator */}
                {saved[staff._id] && chosen && (
                  <span className="text-[9px] text-green-400 shrink-0">✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Save button */}
      <button onClick={saveAll} disabled={saving || !Object.keys(pending).length}
        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition disabled:opacity-40 text-sm sticky bottom-2">
        {saving ? "Saving..." : `Save Attendance (${Object.values(pending).filter(Boolean).length} marked)`}
      </button>
    </div>
  );
};

/* ════════════════════════════════════════════
   MONTHLY REPORT VIEW
   Clean table: Name | Services | Revenue | Attendance%
   Tap row to expand → service detail
════════════════════════════════════════════ */
const MonthlyReportView = ({ allStaff, onBack, onAddManual }) => {
  const [month,    setMonth]    = useState(currentMonth());
  const [report,   setReport]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [expanded, setExpanded] = useState(null); // staffId or null
  const [bkgView,  setBkgView]  = useState("all"); // all|website|manual

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/staff/report/monthly?month=${month}`);
      setReport(res.data.data || []);
    } catch { toastError("Failed to load"); }
    setLoading(false);
  }, [month]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const deleteManual = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try { await api.delete(`/staff/manual-booking/${id}`); toastSuccess("Deleted"); fetchReport(); }
    catch { toastError("Failed"); }
  };

  // Totals row
  const totals = report.reduce((acc, item) => ({
    bookings: acc.bookings + item.totalBookings,
    revenue:  acc.revenue  + item.totalEarnings,
    present:  acc.present  + item.present,
    absent:   acc.absent   + item.absent,
  }), { bookings:0, revenue:0, present:0, absent:0 });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl transition text-lg">‹</button>
        <div className="flex-1">
          <h2 className="text-white font-bold text-base">Monthly Report</h2>
          <p className="text-gray-400 text-xs">{report.length} staff with data</p>
        </div>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl outline-none focus:border-amber-500 transition" />
      </div>

      {/* Summary totals */}
      {report.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label:"Staff",    val:report.length,              cls:"text-white"       },
            { label:"Services", val:totals.bookings,            cls:"text-amber-400"   },
            { label:"Revenue",  val:`AED ${totals.revenue.toLocaleString()}`, cls:"text-green-400" },
            { label:"Present",  val:totals.present,             cls:"text-blue-400"    },
          ].map(({label,val,cls})=>(
            <div key={label} className="bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
              <p className={`text-sm font-bold ${cls}`}>{val}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : report.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-gray-400 text-sm">No data for this month</p>
        </div>
      ) : (
        <div className="space-y-2">
          {report.map(item => {
            const sid  = item.staff._id?.toString?.() || item.staff._id;
            const isEx = expanded === sid;
            const rate = item.totalDays > 0
              ? Math.round(((item.present + (item.halfDay||0)*0.5) / item.totalDays)*100) : 0;

            const allBkgs = [
              ...(item.websiteBookings||[]).map(b=>({...b,_bt:"website"})),
              ...(item.manualBookings ||[]).map(b=>({...b,_bt:"manual" })),
            ].sort((a,b)=>a.date<b.date?1:-1);

            const shownBkgs = bkgView==="all" ? allBkgs
              : allBkgs.filter(b=>b._bt===bkgView);

            return (
              <div key={sid} className="bg-gray-900 border border-gray-700/50 rounded-xl overflow-hidden">

                {/* ── Main row (always visible) ── */}
                <div onClick={()=>{ setExpanded(isEx?null:sid); setBkgView("all"); }}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800/60 transition select-none">

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 font-bold">{item.staff.name?.[0]?.toUpperCase()}</span>
                  </div>

                  {/* Name + spec */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{item.staff.name}</p>
                    <p className="text-gray-500 text-[10px] truncate">{item.staff.specialization?.join(", ") || "—"}</p>
                  </div>

                  {/* Stats inline */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Attendance % */}
                    <div className="text-center hidden sm:block">
                      <p className={`text-sm font-bold ${rate>=80?"text-green-400":rate>=50?"text-yellow-400":"text-red-400"}`}>{rate}%</p>
                      <p className="text-[9px] text-gray-500">Attd.</p>
                    </div>
                    {/* Services */}
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{item.totalBookings}</p>
                      <p className="text-[9px] text-gray-500">Jobs</p>
                    </div>
                    {/* Revenue */}
                    <div className="text-center">
                      <p className="text-sm font-bold text-amber-400">AED {item.totalEarnings?.toLocaleString()}</p>
                      <p className="text-[9px] text-gray-500">Revenue</p>
                    </div>
                    {/* Chevron */}
                    <span className={`text-gray-500 text-lg transition-transform ${isEx?"rotate-90":""}`}>›</span>
                  </div>
                </div>

                {/* ── Expanded detail ── */}
                {isEx && (
                  <div className="border-t border-gray-800 bg-black/30">

                    {/* Attendance breakdown */}
                    <div className="grid grid-cols-4 gap-0 border-b border-gray-800">
                      {[
                        { label:"Present",  val:item.present,           cls:"text-green-400"  },
                        { label:"Absent",   val:item.absent,            cls:"text-red-400"    },
                        { label:"Half Day", val:item.halfDay||0,        cls:"text-yellow-400" },
                        { label:"Leave",    val:item.leave||0,          cls:"text-blue-400"   },
                      ].map(({label,val,cls})=>(
                        <div key={label} className="text-center py-3 border-r border-gray-800 last:border-0">
                          <p className={`text-base font-bold ${cls}`}>{val}</p>
                          <p className="text-[9px] text-gray-500">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Booking filter + add manual */}
                    <div className="flex items-center gap-2 p-3 border-b border-gray-800 flex-wrap">
                      <div className="flex gap-1.5 flex-1">
                        {[
                          {v:"all",     l:`All (${allBkgs.length})`                         },
                          {v:"website", l:`🌐 (${item.websiteBookings?.length||0})`         },
                          {v:"manual",  l:`📝 (${item.manualBookings?.length||0})`          },
                        ].map(({v,l})=>(
                          <button key={v} onClick={e=>{e.stopPropagation();setBkgView(v)}}
                            className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition ${bkgView===v?"bg-amber-500 text-black":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                            {l}
                          </button>
                        ))}
                      </div>
                      <button onClick={e=>{e.stopPropagation(); onAddManual(item.staff)}}
                        className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-400 text-[10px] font-bold rounded-lg transition">
                        + Add Manual
                      </button>
                    </div>

                    {/* Bookings list */}
                    {shownBkgs.length === 0 ? (
                      <div className="py-6 text-center">
                        <p className="text-gray-500 text-xs">No bookings found</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-800/60">
                        {shownBkgs.map((b,i)=>(
                          <div key={i} className="flex items-center gap-2.5 px-3 py-2.5">
                            {/* Source icon */}
                            <span className="text-base shrink-0">{sourceLabel(b.source||b._bt)}</span>
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-semibold truncate">{b.customerName}</p>
                              <p className="text-amber-300 text-[10px] italic truncate">{b.services}</p>
                              <p className="text-gray-500 text-[10px]">{fmtDate(b.date)}{b.time && ` • ${b.time}`}</p>
                            </div>
                            {/* Amount */}
                            <p className="text-amber-400 text-sm font-bold shrink-0">AED {b.amount}</p>
                            {/* Delete manual */}
                            {b._bt==="manual" && b._id && (
                              <button onClick={e=>{e.stopPropagation();deleteManual(b._id)}}
                                className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition shrink-0 text-xs">
                                🗑
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mini attendance log */}
                    {item.records?.length > 0 && (
                      <div className="border-t border-gray-800 p-3">
                        <p className="text-[10px] text-gray-500 font-semibold mb-2 uppercase tracking-wider">Attendance Log</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.records.map(rec=>(
                            <span key={rec.date} title={rec.date}
                              className={`px-2 py-1 text-[9px] font-bold rounded-lg ${statusCls(rec.status)}`}>
                              {fmtDate(rec.date)} · {rec.status[0].toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN STAFF TAB
════════════════════════════════════════════ */
const StaffTab = ({ onManualBookingAdded }) => {
  const { staff, loadStaff, deleteStaff } = useInventory();
  const { admin } = useAdmin();

  const [view, setView] = useState("list"); // list | attendance | report
  const [showForm,   setShowForm]   = useState(false);
  const [editStaff,  setEditStaff]  = useState(null);
  const [manualModal, setManualModal] = useState(null); // null | { defaultStaff }
  const [filterFor,  setFilterFor]  = useState("");
  const [filterSpec, setFilterSpec] = useState("");
  const [search,     setSearch]     = useState("");

  useEffect(() => { loadStaff(); }, []);
  useEffect(() => {
    const f = {};
    if (filterFor)  f.servicesFor    = filterFor;
    if (filterSpec) f.specialization = filterSpec;
    loadStaff(f);
  }, [filterFor, filterSpec]);

  const available = staff.filter(s => s.isAvailable).length;

  const filteredStaff = staff.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.specialization?.some(sp => sp.toLowerCase().includes(search.toLowerCase()))
  );

  // Navigate views
  if (view === "attendance") return (
    <AttendanceView onBack={() => setView("list")} />
  );

  if (view === "report") return (
    <MonthlyReportView
      allStaff={staff}
      onBack={() => setView("list")}
      onAddManual={(defaultStaff) => { setView("list"); setManualModal({ defaultStaff }); }}
    />
  );

  return (
    <div>
      {/* ── Top Stats ── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-white">{staff.length}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Total Staff</p>
        </div>
        <div className="bg-green-900/30 border border-green-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{available}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Available</p>
        </div>
        <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{staff.length - available}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Busy</p>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button onClick={()=>setView("attendance")}
          className="flex flex-col items-center gap-1.5 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition">
          <span className="text-xl">📅</span>
          <span className="text-[11px] text-gray-300 font-semibold">Attendance</span>
        </button>
        <button onClick={()=>setView("report")}
          className="flex flex-col items-center gap-1.5 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition">
          <span className="text-xl">📊</span>
          <span className="text-[11px] text-gray-300 font-semibold">Reports</span>
        </button>
        <button onClick={()=>setManualModal({defaultStaff:null})}
          className="flex flex-col items-center gap-1.5 py-3 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 rounded-xl transition">
          <span className="text-xl">📝</span>
          <span className="text-[11px] text-purple-400 font-semibold">Manual</span>
        </button>
      </div>

      {/* ── Search + filter ── */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-32">
          <input type="text" placeholder="Search staff..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl focus:border-amber-500 outline-none transition placeholder-gray-500" />
          {search && <button onClick={()=>setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">✕</button>}
        </div>
        <select value={filterFor} onChange={e=>setFilterFor(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl outline-none">
          <option value="">All</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="both">Both</option>
        </select>
        <select value={filterSpec} onChange={e=>setFilterSpec(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl outline-none">
          <option value="">All Skills</option>
          {SPECIALIZATIONS.map(s=><option key={s}>{s}</option>)}
        </select>
        <button onClick={()=>{setEditStaff(null);setShowForm(true)}}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded-xl transition">
          + Add
        </button>
      </div>

      {/* ── Staff list ── */}
      {filteredStaff.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-gray-400 text-sm">No staff found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredStaff.map(member => (
            <div key={member._id} className="bg-gray-900 border border-gray-700/50 rounded-xl p-3 flex items-center gap-3">
              {/* Avatar with availability dot */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-base">{member.name[0]?.toUpperCase()}</span>
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${member.isAvailable?"bg-green-500":"bg-red-500"}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white text-sm font-bold">{member.name}</p>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-gray-700 text-gray-300 capitalize">{member.servicesFor}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${member.isAvailable?"bg-green-500/20 text-green-400":"bg-red-500/20 text-red-400"}`}>
                    {member.isAvailable?"●  Available":"● Busy"}
                  </span>
                </div>
                {member.phone && <p className="text-gray-500 text-[10px] mt-0.5">{member.phone}</p>}
                {member.specialization?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {member.specialization.map(spec=>(
                      <span key={spec} className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">{spec}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions — compact */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={()=>setManualModal({defaultStaff:member})}
                  className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 text-[10px] font-bold rounded-lg transition">
                  + Manual
                </button>
                <button onClick={()=>{setEditStaff(member);setShowForm(true)}}
                  className="px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-[10px] font-bold rounded-lg transition">
                  Edit
                </button>
                {admin?.role==="super-admin" && (
                  <button onClick={()=>deleteStaff(member._id)}
                    className="px-2.5 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-[10px] font-bold rounded-lg transition">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <StaffFormModal staffMember={editStaff} onClose={()=>{setShowForm(false);setEditStaff(null);}} />
      )}
      {manualModal && (
        <ManualBookingModal
          allStaff={staff}
          defaultStaff={manualModal.defaultStaff}
          onClose={()=>setManualModal(null)}
          onSaved={()=>{ loadStaff(); onManualBookingAdded?.(); }}
        />
      )}
    </div>
  );
};

export default StaffTab;