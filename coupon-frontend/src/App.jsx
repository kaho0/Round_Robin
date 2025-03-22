import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CouponList from "./components/CouponList";
import ClaimCoupon from "./components/ClaimCoupon";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

import { BrowserRouter, Routes, Route } from "react-router-dom";

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
