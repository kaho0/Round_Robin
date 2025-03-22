import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render the outlet (child routes)
  return <Outlet />;
};

export default ProtectedRoute;
