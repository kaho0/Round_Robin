import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CouponList from "./components/CouponList";
import ClaimCoupon from "./components/ClaimCoupon";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CouponList />} />
        <Route path="/claim" element={<ClaimCoupon />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
