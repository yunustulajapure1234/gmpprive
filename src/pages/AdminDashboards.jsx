import React, { useState, useEffect, useCallback } from "react";
import { useAdmin }     from "../context/AdminContext";
import { useInventory } from "../context/InventoryContext";
import { useNavigate }  from "react-router-dom";
import api from "../api/api";
import { toastSuccess, toastError } from "../utils/alert";

import ServiceForm  from "../components/admin/ServiceForm";
import ServiceList  from "../components/admin/ServiceList";
import PackageForm  from "../components/admin/PackageForm";
import PackageList  from "../components/admin/PackageList";
import InventoryTab from "../components/admin/InventoryTab";
import StaffTab     from "../components/admin/StaffTab";

const TABS = ["dashboard", "women", "men", "packages", "bookings", "inventory", "staff"];

const todayStr = () => new Date().toISOString().split("T")[0];

/* ── Source badge ─────────────────────────── */
const SourceBadge = ({ source }) => {
  const map = {
    website:  { label: "🌐 Website",  cls: "bg-blue-500/20 text-blue-400 border-blue-500/30"       },
    call:     { label: "📞 Call",     cls: "bg-green-500/20 text-green-400 border-green-500/30"     },
    whatsapp: { label: "💬 WhatsApp", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    walkin:   { label: "🚶 Walk-in",  cls: "bg-orange-500/20 text-orange-400 border-orange-500/30"  },
    manual:   { label: "📝 Manual",   cls: "bg-purple-500/20 text-purple-400 border-purple-500/30"  },
  };
  const { label, cls } = map[source] || map.manual;
  return <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${cls}`}>{label}</span>;
};

const statusBadgeCls = (s) =>
  s === "pending"     ? "bg-yellow-500/20 text-yellow-400" :
  s === "confirmed"   ? "bg-blue-500/20 text-blue-400"     :
  s === "in-progress" ? "bg-orange-500/20 text-orange-400" :
  s === "completed"   ? "bg-green-500/20 text-green-400"   : "bg-red-500/20 text-red-400";

/* ─────────────────────────────────────────── */
const AdminDashboard = () => {
  const { logout, admin, bookings, fetchStats, loadBookings, updateBookingStatus } = useAdmin();
  const { lowStockAlerts, loadLowStockAlerts } = useInventory();
  const navigate = useNavigate();

  const [activeTab,       setActiveTab]       = useState("dashboard");
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService,  setEditingService]  = useState(null);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage,  setEditingPackage]  = useState(null);

  // Bookings state
  const [searchTerm,       setSearchTerm]       = useState("");
  const [bookingFilter,    setBookingFilter]     = useState("all");   // all|website|manual
  const [dateFilter,       setDateFilter]        = useState("");       // YYYY-MM-DD or ""
  const [statusFilter,     setStatusFilter]      = useState("");       // pending|confirmed|completed|cancelled|""
  const [expandedBookings, setExpandedBookings]  = useState({});
  const [staffList,        setStaffList]         = useState([]);
  const [assigningBooking, setAssigningBooking]  = useState(null);
  const [manualBookings,   setManualBookings]    = useState([]);

  const loadStaffList = useCallback(async () => {
    try { const res = await api.get("/staff"); setStaffList(res.data.data || []); } catch (_) {}
  }, []);

  const loadManualBookings = useCallback(async () => {
    try { const res = await api.get("/staff/manual-bookings"); setManualBookings(res.data.data || []); } catch (_) {}
  }, []);

  useEffect(() => {
    fetchStats(); loadBookings(); loadLowStockAlerts(); loadStaffList(); loadManualBookings();
  }, []);

  const totalAlerts =
    (lowStockAlerts?.outOfStock?.length || 0) +
    (lowStockAlerts?.critical?.length   || 0) +
    (lowStockAlerts?.low?.length        || 0);

  /* ── Combined + normalized bookings ─────── */
  const allCombined = [
    ...bookings.map((b) => ({ ...b, _type: "website", source: "website" })),
    ...manualBookings.map((b) => ({
      ...b, _type: "manual", source: b.source || "manual",
      status: b.status || "completed",
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredBookings = allCombined.filter((b) => {
    const q = searchTerm.toLowerCase().replace(/[#\s]/g, "");
    const matchSearch =
      !q ||
      (b.bookingNumber || "").toLowerCase().replace(/[#\s]/g, "").includes(q) ||
      (b.customerName  || "").toLowerCase().includes(q) ||
      (b.phone         || "").toLowerCase().includes(q);

    const matchSource =
      bookingFilter === "all"     ? true :
      bookingFilter === "website" ? b._type === "website" :
      bookingFilter === "manual"  ? b._type === "manual"  : true;

    const matchDate =
      !dateFilter ? true :
      new Date(b.date).toISOString().split("T")[0] === dateFilter;

    const matchStatus =
      !statusFilter ? true :
      b.status === statusFilter;

    return matchSearch && matchSource && matchDate && matchStatus;
  });

  /* ── Analytics (website + manual both) ──── */
  const analytics = (() => {
    const now   = new Date();
    const today = now.toDateString();
    const weekAgo    = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart  = new Date(now.getFullYear(), 0, 1);
    const rev = (arr) => arr.reduce((s, b) => s + (b.totalAmount || 0), 0);

    const wC = bookings.filter((b) => b.status === "completed");
    const mC = manualBookings.filter((b) => b.status === "completed");

    const merge = (wArr, mArr) => ({ count: wArr.length + mArr.length, revenue: rev(wArr) + rev(mArr) });

    return {
      statusCounts: {
        pending:   bookings.filter((b) => b.status === "pending").length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        completed: bookings.filter((b) => b.status === "completed").length,
        cancelled: bookings.filter((b) => b.status === "cancelled").length,
      },
      today:   merge(wC.filter((b) => new Date(b.date).toDateString() === today), mC.filter((b) => new Date(b.date).toDateString() === today)),
      weekly:  merge(wC.filter((b) => new Date(b.date) >= weekAgo),    mC.filter((b) => new Date(b.date) >= weekAgo)),
      monthly: merge(wC.filter((b) => new Date(b.date) >= monthStart), mC.filter((b) => new Date(b.date) >= monthStart)),
      yearly:  merge(wC.filter((b) => new Date(b.date) >= yearStart),  mC.filter((b) => new Date(b.date) >= yearStart)),
      total:   merge(wC, mC),
      manualCount: manualBookings.length,
      manualRev: rev(mC),
    };
  })();

  /* ── Quick "Today" view for dashboard ───── */
  const todayBookings = allCombined.filter((b) =>
    new Date(b.date).toISOString().split("T")[0] === todayStr()
  );

  /* ── Actions ─────────────────────────────── */
  const handleAssignStaff = async (bookingId, staffId) => {
    setAssigningBooking(bookingId);
    try {
      if (!staffId) await api.put(`/staff/unassign/${bookingId}`);
      else          await api.put(`/staff/assign/${bookingId}`, { staffId });
      await loadBookings(); await loadStaffList();
      toastSuccess(staffId ? "Staff assigned" : "Staff unassigned");
    } catch (err) { toastError(err.response?.data?.message || "Failed"); }
    setAssigningBooking(null);
  };

  const handleDeleteManual = async (id) => {
    if (!window.confirm("Delete this manual booking?")) return;
    try { await api.delete(`/staff/manual-booking/${id}`); toastSuccess("Deleted"); loadManualBookings(); }
    catch { toastError("Delete failed"); }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    await updateBookingStatus(bookingId, newStatus);
    if (newStatus === "completed") { loadLowStockAlerts(); loadStaffList(); }
  };

  const goToBookingsToday = () => { setDateFilter(todayStr()); setBookingFilter("all"); setActiveTab("bookings"); };

  const toggleBooking = (id) => setExpandedBookings((p) => ({ ...p, [id]: !p[id] }));

  /* ── Single booking card ─────────────────── */
  const BookingCard = ({ booking }) => {
    const isExpanded  = expandedBookings[booking._id];
    const isAssigning = assigningBooking === booking._id;
    const isManual    = booking._type === "manual";

    return (
      <div className={`border rounded-lg overflow-hidden ${isManual ? "bg-gray-900 border-purple-700/40" : "bg-gray-900 border-gray-700"}`}>
        {/* Header */}
        <div onClick={() => toggleBooking(booking._id)} className="p-3 cursor-pointer hover:bg-gray-800/80 transition">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`transition-transform inline-block text-gray-400 ${isExpanded ? "rotate-90" : ""}`}>›</span>
                <span className="text-amber-400 text-xs font-mono">#{booking.bookingNumber}</span>
                <SourceBadge source={booking.source} />
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${statusBadgeCls(booking.status)}`}>
                  {booking.status.toUpperCase()}
                </span>
                {booking.assignedStaffName && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    👤 {booking.assignedStaffName}
                  </span>
                )}
              </div>
              <p className="text-white text-sm font-semibold mt-1 truncate">{booking.customerName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-gray-400 text-xs">{new Date(booking.date).toLocaleDateString("en-GB")} • {booking.time}</p>
                {booking.phone && <p className="text-gray-500 text-xs">• {booking.phone}</p>}
              </div>
            </div>
            <p className="text-amber-400 text-lg font-bold shrink-0">AED {booking.totalAmount}</p>
          </div>
        </div>

        {/* Expanded */}
        {isExpanded && (
          <div className="border-t border-gray-800 p-3 bg-black/40 space-y-3">
            {/* Services */}
            <div>
              <p className="text-amber-400 font-semibold text-xs mb-1.5">Services</p>
              {isManual ? (
                <div className="border-l-2 border-purple-500 pl-2.5 py-0.5">
                  <p className="text-white text-xs">{booking.servicesText}</p>
                </div>
              ) : (
                booking.services?.map((svc, i) => (
                  <div key={i} className="border-l-2 border-amber-500 pl-2.5 mb-1.5 py-0.5">
                    <p className="text-white text-xs font-medium">{svc.name}</p>
                    <p className="text-gray-400 text-[10px]">Qty: {svc.quantity} | AED {svc.price}</p>
                  </div>
                ))
              )}
            </div>

            {/* Address (website) */}
            {!isManual && booking.address && (
              <div>
                <p className="text-amber-400 font-semibold text-xs mb-1">📍 Address</p>
                <p className="text-gray-300 text-xs">{[booking.address.building, booking.address.apartment, booking.address.area].filter(Boolean).join(", ")}</p>
              </div>
            )}

            {/* Notes (manual) */}
            {isManual && booking.notes && (
              <div className="bg-gray-800 rounded p-2">
                <p className="text-gray-400 text-[10px] mb-0.5">Notes</p>
                <p className="text-gray-200 text-xs">{booking.notes}</p>
              </div>
            )}

            {/* Staff assign (website only) */}
            {!isManual && (
              <div>
                <p className="text-amber-400 font-semibold text-xs mb-1">👤 Assign Staff</p>
                <select
                  value={booking.assignedStaff || ""}
                  disabled={isAssigning}
                  onChange={(e) => { e.stopPropagation(); handleAssignStaff(booking._id, e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-2 py-1.5 bg-gray-800 border border-purple-500/30 text-white text-xs rounded outline-none disabled:opacity-50">
                  <option value="">— No Staff —</option>
                  {staffList.map((s) => (
                    <option key={s._id} value={s._id} disabled={!s.isAvailable && booking.assignedStaff !== s._id}>
                      {s.name}{s.specialization?.length ? ` (${s.specialization.join(", ")})` : ""}
                      {!s.isAvailable && booking.assignedStaff !== s._id ? " — Busy" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status change (website only) */}
            {!isManual && (
              <select
                value={booking.status}
                onChange={(e) => { e.stopPropagation(); handleStatusChange(booking._id, e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-2 py-1.5 bg-gray-800 border border-amber-500/30 text-white text-xs rounded outline-none">
                <option value="pending">🕐 Pending</option>
                <option value="confirmed">✅ Confirmed</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="completed">✔️ Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            )}

            {/* Delete (manual) */}
            {isManual && (
              <button onClick={(e) => { e.stopPropagation(); handleDeleteManual(booking._id); }}
                className="w-full py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs rounded transition">
                🗑 Delete Manual Booking
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">

      {/* ── HEADER ── */}
      <header className="bg-gray-900 border-b border-amber-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 h-14 flex justify-between items-center">
          <h1 className="text-lg font-bold text-amber-500">GMP Prive</h1>
          <div className="flex items-center gap-2">
            {totalAlerts > 0 && (
              <button onClick={() => setActiveTab("inventory")}
                className="flex items-center gap-1 px-2 py-1 bg-red-900/30 border border-red-500/30 rounded text-red-400 text-xs font-semibold animate-pulse">
                ⚠️ {totalAlerts}
              </button>
            )}
            <p className="text-xs text-amber-400 hidden sm:block">{admin?.name}</p>
            <button onClick={() => { logout(); navigate("/admin"); }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 mt-3">

        {/* ── TABS ── */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm rounded font-medium whitespace-nowrap transition relative capitalize ${activeTab === tab ? "bg-amber-500 text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
              {tab}
              {tab === "inventory" && totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{totalAlerts}</span>
              )}
            </button>
          ))}
        </div>

        {/* ━━━━━━━━━━ DASHBOARD ━━━━━━━━━━ */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* Stock alert */}
            {totalAlerts > 0 && (
              <button onClick={() => setActiveTab("inventory")}
                className="w-full bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-3 hover:bg-red-900/30 transition text-left">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-red-400 text-sm font-bold">
                    {[lowStockAlerts.outOfStock?.length > 0 && `${lowStockAlerts.outOfStock.length} out of stock`, lowStockAlerts.critical?.length > 0 && `${lowStockAlerts.critical.length} critical`, lowStockAlerts.low?.length > 0 && `${lowStockAlerts.low.length} low`].filter(Boolean).join(" • ")}
                  </p>
                  <p className="text-gray-400 text-xs">Tap to manage inventory →</p>
                </div>
              </button>
            )}

            {/* Status counts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Pending",   val: analytics.statusCounts.pending,   bg: "bg-yellow-600" },
                { label: "Confirmed", val: analytics.statusCounts.confirmed, bg: "bg-blue-600"   },
                { label: "Completed", val: analytics.statusCounts.completed, bg: "bg-green-600"  },
                { label: "Cancelled", val: analytics.statusCounts.cancelled, bg: "bg-red-600"    },
              ].map(({ label, val, bg }) => (
                <div key={label} className={`${bg} rounded-lg p-3`}>
                  <p className="text-xs text-black/70">{label}</p>
                  <p className="text-2xl font-bold text-black">{val}</p>
                </div>
              ))}
            </div>

            {/* TODAY + MANUAL — two clean clickable stat cards */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={goToBookingsToday}
                className="bg-gray-800 border border-amber-500/30 rounded-xl p-4 text-left hover:bg-gray-700/80 transition">
                <p className="text-amber-400 font-bold text-sm mb-1">📅 Today</p>
                <p className="text-3xl font-bold text-white">{todayBookings.length}</p>
                <p className="text-amber-400 text-xs font-semibold mt-1">
                  AED {todayBookings.reduce((s, b) => s + (b.totalAmount || 0), 0).toLocaleString()}
                </p>
                <p className="text-gray-500 text-[10px] mt-1">Tap to view →</p>
              </button>

              <button onClick={() => { setBookingFilter("manual"); setDateFilter(""); setActiveTab("bookings"); }}
                className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 text-left hover:bg-purple-900/30 transition">
                <p className="text-purple-400 font-bold text-sm mb-1">📝 Manual</p>
                <p className="text-3xl font-bold text-white">{analytics.manualCount}</p>
                <p className="text-purple-400 text-xs font-semibold mt-1">
                  AED {analytics.manualRev.toLocaleString()}
                </p>
                <p className="text-gray-500 text-[10px] mt-1">Tap to view →</p>
              </button>
            </div>

            {/* Period stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "📊 This Week",  data: analytics.weekly,  color: "text-purple-400" },
                { label: "📈 This Month", data: analytics.monthly, color: "text-green-400"  },
                { label: "🎯 This Year",  data: analytics.yearly,  color: "text-amber-400"  },
                { label: "📦 All Time",   data: analytics.total,   color: "text-white"       },
              ].map(({ label, data, color }) => (
                <div key={label} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">{label}</p>
                  <p className="text-white text-sm font-semibold">{data.count} bookings</p>
                  <p className={`${color} text-xl font-bold`}>AED {data.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Total revenue card */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-5">
              <p className="text-black/70 text-sm mb-1">Total Revenue (Website + Manual)</p>
              <p className="text-3xl sm:text-4xl font-bold text-black">AED {analytics.total.revenue.toLocaleString()}</p>
              <div className="mt-3 pt-3 border-t border-black/20 grid grid-cols-3 gap-3">
                <div><p className="text-black/60 text-xs">Website</p><p className="text-lg font-bold text-black">{analytics.statusCounts.completed}</p></div>
                <div><p className="text-black/60 text-xs">Manual</p><p className="text-lg font-bold text-black">{analytics.manualCount}</p></div>
                <div><p className="text-black/60 text-xs">Avg</p><p className="text-lg font-bold text-black">AED {(analytics.total.count > 0 ? Math.round(analytics.total.revenue / analytics.total.count) : 0).toLocaleString()}</p></div>
              </div>
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━ SERVICES ━━━━━━━━━━ */}
        {(activeTab === "women" || activeTab === "men") && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-amber-400 capitalize">{activeTab} Services</h2>
              <button onClick={() => setShowServiceForm(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold rounded transition">+ Add</button>
            </div>
            <ServiceList gender={activeTab} onEdit={(s) => { setEditingService(s); setShowServiceForm(true); }} />
          </>
        )}

        {/* ━━━━━━━━━━ PACKAGES ━━━━━━━━━━ */}
        {activeTab === "packages" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-amber-400">Packages</h2>
              <button onClick={() => setShowPackageForm(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold rounded transition">+ Add</button>
            </div>
            <PackageList onEdit={(p) => { setEditingPackage(p); setShowPackageForm(true); }} />
          </>
        )}

        {/* ━━━━━━━━━━ BOOKINGS ━━━━━━━━━━ */}
        {activeTab === "bookings" && (
          <div>
            {/* Search bar */}
            <div className="relative mb-3">
              <input type="text" placeholder="🔍  Search name, phone, booking #..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-gray-500 outline-none" />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-lg">✕</button>
              )}
            </div>

            {/* Filter row */}
            <div className="flex gap-2 flex-wrap mb-3">
              {/* Source filter */}
              {[
                { val: "all",     label: `All (${allCombined.length})`          },
                { val: "website", label: `🌐 Website (${bookings.length})`       },
                { val: "manual",  label: `📝 Manual (${manualBookings.length})` },
              ].map(({ val, label }) => (
                <button key={val} onClick={() => setBookingFilter(val)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${bookingFilter === val ? "bg-amber-500 text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
                  {label}
                </button>
              ))}

              {/* Date filter */}
              <div className="flex items-center gap-1 ml-auto">
                <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
                  className="px-2 py-1.5 bg-gray-800 border border-gray-700 text-white text-xs rounded-lg outline-none focus:border-amber-500" />
                {dateFilter && (
                  <button onClick={() => setDateFilter("")} className="text-gray-400 hover:text-white text-sm px-1">✕</button>
                )}
              </div>
            </div>

            {/* Status filter chips */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {["", "pending", "confirmed", "in-progress", "completed", "cancelled"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition capitalize border ${
                    statusFilter === s
                      ? s === "" ? "bg-gray-600 text-white border-gray-500" :
                        s === "pending"     ? "bg-yellow-500/30 text-yellow-300 border-yellow-500"   :
                        s === "confirmed"   ? "bg-blue-500/30 text-blue-300 border-blue-500"         :
                        s === "in-progress" ? "bg-orange-500/30 text-orange-300 border-orange-500"   :
                        s === "completed"   ? "bg-green-500/30 text-green-300 border-green-500"      :
                                              "bg-red-500/30 text-red-300 border-red-500"
                      : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700"
                  }`}>
                  {s === "" ? "All Status" : s}
                </button>
              ))}
            </div>

            <p className="text-gray-500 text-xs mb-3">
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""}
              {dateFilter && ` on ${new Date(dateFilter).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
            </p>

            {/* Booking list */}
            <div className="space-y-2">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-400 text-sm">No bookings found</p>
                {(searchTerm || dateFilter || statusFilter || bookingFilter !== "all") && (
                  <button onClick={() => { setSearchTerm(""); setDateFilter(""); setStatusFilter(""); setBookingFilter("all"); }}
                    className="mt-3 px-4 py-2 bg-amber-500 text-black text-sm font-bold rounded-lg hover:bg-amber-600 transition">
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ━━━━━━━━━━ INVENTORY ━━━━━━━━━━ */}
        {activeTab === "inventory" && (
          <><h2 className="text-lg font-bold text-amber-400 mb-4">Inventory</h2><InventoryTab /></>
        )}

        {/* ━━━━━━━━━━ STAFF ━━━━━━━━━━ */}
        {activeTab === "staff" && (
          <><h2 className="text-lg font-bold text-amber-400 mb-4">Staff</h2>
          <StaffTab onManualBookingAdded={loadManualBookings} /></>
        )}
      </div>

      {/* Modals */}
      {showServiceForm && (
        <ServiceForm gender={activeTab} service={editingService}
          onClose={() => { setEditingService(null); setShowServiceForm(false); }} />
      )}
      {showPackageForm && (
        <PackageForm pkg={editingPackage}
          onClose={() => { setEditingPackage(null); setShowPackageForm(false); }} />
      )}
    </div>
  );
};

export default AdminDashboard;