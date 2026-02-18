import React, { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

import ServiceForm from "../components/admin/ServiceForm";
import ServiceList from "../components/admin/ServiceList";
import PackageForm from "../components/admin/PackageForm";
import PackageList from "../components/admin/PackageList";

const AdminDashboard = () => {
  const {
    logout,
    getServicesByGender,
    packages,
    admin,
    stats,
    bookings,
    fetchStats,
    loadBookings,
    updateBookingStatus,
  } = useAdmin();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBookings, setExpandedBookings] = useState({});

  const womenServices = getServicesByGender("women");
  const menServices = getServicesByGender("men");

  useEffect(() => {
    fetchStats();
    loadBookings();
  }, []);

  const handleAddNew = () => {
    if (activeTab === "packages") {
      setShowPackageForm(true);
    } else {
      setShowServiceForm(true);
    }
  };

  // Calculate analytics - ONLY COMPLETED bookings count in revenue
  const calculateAnalytics = () => {
    const now = new Date();
    const today = now.toDateString();
    
    // Count by status
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const completedCount = bookings.filter(b => b.status === 'completed').length;
    const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
    
    // Today's bookings - only completed
    const todayBookings = bookings.filter(
      b => new Date(b.date).toDateString() === today
    );
    const todayCompleted = todayBookings.filter(b => b.status === 'completed');
    const todayRevenue = todayCompleted.reduce((sum, b) => sum + b.totalAmount, 0);
    
    // This week's bookings (last 7 days) - only completed
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyBookings = bookings.filter(
      b => new Date(b.date) >= weekAgo
    );
    const weeklyCompleted = weeklyBookings.filter(b => b.status === 'completed');
    const weeklyRevenue = weeklyCompleted.reduce((sum, b) => sum + b.totalAmount, 0);
    
    // This month's bookings - only completed
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyBookings = bookings.filter(
      b => new Date(b.date) >= monthStart
    );
    const monthlyCompleted = monthlyBookings.filter(b => b.status === 'completed');
    const monthlyRevenue = monthlyCompleted.reduce((sum, b) => sum + b.totalAmount, 0);
    
    // This year's bookings - only completed
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearlyBookings = bookings.filter(
      b => new Date(b.date) >= yearStart
    );
    const yearlyCompleted = yearlyBookings.filter(b => b.status === 'completed');
    const yearlyRevenue = yearlyCompleted.reduce((sum, b) => sum + b.totalAmount, 0);
    
    // Total - ONLY completed bookings
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    
    return {
      statusCounts: {
        pending: pendingCount,
        confirmed: confirmedCount,
        completed: completedCount,
        cancelled: cancelledCount,
      },
      today: { count: todayCompleted.length, revenue: todayRevenue },
      weekly: { count: weeklyCompleted.length, revenue: weeklyRevenue },
      monthly: { count: monthlyCompleted.length, revenue: monthlyRevenue },
      yearly: { count: yearlyCompleted.length, revenue: yearlyRevenue },
      total: { count: completedBookings.length, revenue: totalRevenue },
    };
  };

  const analytics = calculateAnalytics();

  // Filter bookings by search term (booking number, customer name, phone)
  const filteredBookings = bookings.filter(booking => {
    const search = searchTerm.toLowerCase().replace(/[#\s]/g, '');
    const bookingNum = (booking.bookingNumber || '').toLowerCase().replace(/[#\s]/g, '');
    const name = (booking.customerName || '').toLowerCase();
    const phone = (booking.phone || '').toLowerCase();
    
    return (
      bookingNum.includes(search) ||
      name.includes(search) ||
      phone.includes(search)
    );
  });

  // Toggle booking expansion
  const toggleBooking = (bookingId) => {
    setExpandedBookings(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* HEADER - Compact */}
      <header className="bg-gray-900 border-b border-amber-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 h-14 flex justify-between items-center">
          <h1 className="text-base sm:text-lg font-bold text-amber-500">GMP Privé</h1>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-amber-400">{admin?.name}</p>
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/admin");
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION - Compact */}
      <div className="max-w-7xl mx-auto px-3 mt-3">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {["dashboard", "women", "men", "packages", "bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm rounded font-medium whitespace-nowrap transition ${
                activeTab === tab
                  ? "bg-amber-500 text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* Status Cards - Compact */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-yellow-600 rounded-lg p-3">
                <p className="text-xs text-black/70">Pending</p>
                <p className="text-2xl font-bold text-black">{analytics.statusCounts.pending}</p>
              </div>
              <div className="bg-blue-600 rounded-lg p-3">
                <p className="text-xs text-black/70">Confirmed</p>
                <p className="text-2xl font-bold text-black">{analytics.statusCounts.confirmed}</p>
              </div>
              <div className="bg-green-600 rounded-lg p-3">
                <p className="text-xs text-black/70">Completed</p>
                <p className="text-2xl font-bold text-black">{analytics.statusCounts.completed}</p>
              </div>
              <div className="bg-red-600 rounded-lg p-3">
                <p className="text-xs text-black/70">Cancelled</p>
                <p className="text-2xl font-bold text-black">{analytics.statusCounts.cancelled}</p>
              </div>
            </div>

            {/* Analytics - Compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-800 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-400 text-sm mb-2">📅 Today</p>
                <p className="text-white text-lg font-bold">{analytics.today.count} bookings</p>
                <p className="text-blue-400 text-xl font-bold">AED {analytics.today.revenue}</p>
              </div>

              <div className="bg-gray-800 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-400 text-sm mb-2">📊 This Week</p>
                <p className="text-white text-lg font-bold">{analytics.weekly.count} bookings</p>
                <p className="text-purple-400 text-xl font-bold">AED {analytics.weekly.revenue}</p>
              </div>

              <div className="bg-gray-800 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-400 text-sm mb-2">📈 This Month</p>
                <p className="text-white text-lg font-bold">{analytics.monthly.count} bookings</p>
                <p className="text-green-400 text-xl font-bold">AED {analytics.monthly.revenue}</p>
              </div>

              <div className="bg-gray-800 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-400 text-sm mb-2">🎯 This Year</p>
                <p className="text-white text-lg font-bold">{analytics.yearly.count} bookings</p>
                <p className="text-amber-400 text-xl font-bold">AED {analytics.yearly.revenue}</p>
              </div>
            </div>

            {/* Total - Featured but Compact */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-5">
              <p className="text-black/70 text-sm mb-1">Total Revenue (Completed Only)</p>
              <p className="text-3xl sm:text-4xl font-bold text-black">
                AED {analytics.total.revenue.toLocaleString()}
              </p>
              <div className="mt-3 pt-3 border-t border-black/20 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-black/70 text-xs">Completed</p>
                  <p className="text-xl font-bold text-black">{analytics.total.count}</p>
                </div>
                <div>
                  <p className="text-black/70 text-xs">Avg. Value</p>
                  <p className="text-xl font-bold text-black">
                    AED {analytics.total.count > 0 ? Math.round(analytics.total.revenue / analytics.total.count) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES */}
        {(activeTab === "women" || activeTab === "men") && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-amber-400 capitalize">
                {activeTab} Services
              </h2>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold rounded transition"
              >
                + Add
              </button>
            </div>

            <ServiceList
              gender={activeTab}
              onEdit={(s) => {
                setEditingService(s);
                setShowServiceForm(true);
              }}
            />
          </>
        )}

        {/* PACKAGES */}
        {activeTab === "packages" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-amber-400">Packages</h2>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold rounded transition"
              >
                + Add
              </button>
            </div>

            <PackageList
              onEdit={(p) => {
                setEditingPackage(p);
                setShowPackageForm(true);
              }}
            />
          </>
        )}

        {/* BOOKINGS - Ultra Compact */}
        {activeTab === "bookings" && (
          <div>
            {/* Search - Compact */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search booking #, name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-amber-500/30 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 placeholder-gray-500"
              />
            </div>

            <p className="text-gray-500 text-xs mb-3">
              {filteredBookings.length} of {bookings.length} bookings
            </p>

            {/* Bookings List - Super Compact */}
            <div className="space-y-2">
              {filteredBookings.map((booking) => {
                const isExpanded = expandedBookings[booking._id];
                
                return (
                  <div
                    key={booking._id}
                    className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
                  >
                    {/* Header - Click to Expand */}
                    <div
                      onClick={() => toggleBooking(booking._id)}
                      className="p-3 cursor-pointer hover:bg-gray-800 transition"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-lg transition ${isExpanded ? 'rotate-90' : ''}`}>›</span>
                            <span className="text-amber-400 text-xs font-mono">
                              #{booking.bookingNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                booking.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : booking.status === "confirmed"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : booking.status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {booking.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-white text-sm font-semibold mt-1 truncate">
                            {booking.customerName}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(booking.date).toLocaleDateString()} • {booking.time}
                          </p>
                        </div>

                        <p className="text-amber-400 text-lg font-bold">
                          {booking.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-800 p-3 bg-black/40 space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-gray-500 text-xs">Phone</p>
                            <p className="text-white text-xs">{booking.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Booking #</p>
                            <p className="text-amber-400 text-xs font-mono">{booking.bookingNumber}</p>
                          </div>
                        </div>

                        {/* Services - Compact */}
                        <div>
                          <p className="text-amber-400 font-semibold text-xs mb-2">Services</p>
                          {booking.services.map((service, i) => (
                            <div key={i} className="border-l-2 border-amber-500 pl-2 mb-2">
                              <p className="text-white text-xs font-medium">{service.name}</p>
                              <p className="text-gray-400 text-[10px]">
                                Qty: {service.quantity} | AED {service.price}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Address */}
                        <div>
                          <p className="text-amber-400 font-semibold text-xs mb-1">Address</p>
                          <p className="text-gray-300 text-xs">
                            {booking.address?.building}, {booking.address?.apartment}, {booking.address?.area}
                          </p>
                        </div>

                        {/* Status Dropdown */}
                        <select
                          value={booking.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateBookingStatus(booking._id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2 py-1.5 bg-gray-800 border border-amber-500/30 text-white text-xs rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No bookings found</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-amber-500 text-sm underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {showServiceForm && (
        <ServiceForm
          gender={activeTab}
          service={editingService}
          onClose={() => {
            setEditingService(null);
            setShowServiceForm(false);
          }}
        />
      )}

      {showPackageForm && (
        <PackageForm
          pkg={editingPackage}
          onClose={() => {
            setEditingPackage(null);
            setShowPackageForm(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;