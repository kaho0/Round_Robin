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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CouponList />} />
        <Route path="/claim" element={<ClaimCoupon />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          {/* Add other protected admin routes here if needed */}
        </Route>

        {/* Redirect invalid admin paths to login */}
        <Route
          path="/admin/*"
          element={<Navigate to="/admin/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
