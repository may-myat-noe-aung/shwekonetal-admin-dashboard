import React from "react";
import { Navigate } from "react-router-dom";

// allowedRoles = array of roles that can access this page
export default function ProtectedRoute({allowedRoles, children }) {
  const role = localStorage.getItem("adminRole");
  if (!role) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // logged in but not authorized
    return <Navigate to="/404" replace />;
  }

  return children;
}
