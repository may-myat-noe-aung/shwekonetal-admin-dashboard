import React from "react";
import { Navigate } from "react-router-dom";

// allowedRoles = array of roles that can access this page
export default function ProtectedRoute({ userRole, allowedRoles, children }) {
  if (!userRole) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // logged in but not authorized
    return <Navigate to="/404" replace />;
  }

  return children;
}
