import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CouponList from "./components/CouponList";
import ClaimCoupon from "./components/ClaimCoupon";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute"; // Note: This is imported but not used

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CouponList />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminPanel />} />
        <Route path="/claim" element={<ClaimCoupon />} />
        {/* Add other routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
