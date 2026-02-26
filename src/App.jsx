// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Contexts
import { LanguageProvider } from "./context/LanguageContext";
import { BookingProvider } from "./context/BookingContext";
import AdminProvider from "./context/AdminContext";

// Layout & Common
import Navbar from "./components/Navbar";
import BookingModal from "./components/BookingModal";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";

// Pages
import HomePage from "./pages/HomePage";
import WomenServices from "./pages/WomenServices";
import MenServices from "./pages/MenServices";
import TermsConditions from "./pages/Terms&Conditions";
// Admin
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboards";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// 🔥 PUBLIC LAYOUT
import { Outlet } from "react-router-dom";

const PublicLayout = ({ onCartClick, onBookNow }) => (
  <>
    <Navbar onCartClick={onCartClick} />
    <Outlet />
    <FloatingButtons onCartClick={onCartClick} />
    <Footer />
  </>
);

function App() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  return (
    <Router>
      <AdminProvider>
        <LanguageProvider>
          <BookingProvider>
            <div className="min-h-screen bg-white overflow-x-hidden">

              <Routes>

                {/* ================= ADMIN ================= */}
                <Route path="/admin" element={<AdminLogin />} />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

    
                {/* ================= PUBLIC ================= */}
                <Route
                  element={
                    <PublicLayout
                      onCartClick={() => setShowCart(true)}
                      onBookNow={() => setShowBookingModal(true)}
                    />
                  }
                >
                  <Route
                    path="/"
                    element={
                      <HomePage
                        onBookNowClick={() => setShowBookingModal(true)}
                      />
                    }
                  />

                  <Route
                    path="/women"
                    element={
                      <WomenServices
                        onCartClick={() => setShowCart(true)}
                      />
                    }
                  />

                  <Route
                    path="/men"
                    element={
                      <MenServices
                        onCartClick={() => setShowCart(true)}
                      />
                    }
                  />
                  <Route
                    path="/terms"
                    element={<TermsConditions />}
                  />
                  
                </Route>

              </Routes>

              {/* ===== MODALS ===== */}
              {showBookingModal && (
                <BookingModal
                  onClose={() => setShowBookingModal(false)}
                />
              )}

              {showCart && (
                <Cart
                  onClose={() => setShowCart(false)}
                  onBookingRequired={() => {
                    setShowCart(false);
                    setShowBookingModal(true);
                  }}
                />
              )}

            </div>
          </BookingProvider>
        </LanguageProvider>
      </AdminProvider>
    </Router>
  );
}

export default App;
