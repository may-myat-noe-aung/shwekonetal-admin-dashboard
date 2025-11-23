import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";

// Dashboard Pages
import RoleRedirect from "./RoleRedirect";
import DashboardPage from "./pages/DashboardPage";
import SalePage from "./pages/SalePage";
import GoldManagementPage from "./pages/GoldManagementPage";
import SettingPage from "./pages/SettingPage";
import UserManagementPage from "./pages/UserManagementPage";
import ReportPage from "./pages/ReportPage";
import ChatPage from "./pages/ChatPage";

// Auth Pages
import LoginPage from "./pages/LoginPage";

import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "./roles";
import AdminSetting2 from "./components/Setting2/AdminSetting2";

// const currentUser = { role: localStorage.getItem("adminRole") || null };

const router = createBrowserRouter([
  // Auth routes
  { path: "/login", element: <LoginPage /> },

  // Main dashboard routes
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <RoleRedirect />
      },

      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.OWNER]}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },

      // Sale (all roles)
      {
        path: "sale",
        element: (
          <ProtectedRoute
            allowedRoles={[ROLES.OWNER, ROLES.MANAGER, ROLES.SELLER]}
          >
            <SalePage />
          </ProtectedRoute>
        ),
      },

      // Gold Management (owner + manager)
      {
        path: "gold-management",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.MANAGER]}>
            <GoldManagementPage />
          </ProtectedRoute>
        ),
      },

      // User Management (owner + manager)
      {
        path: "user-management",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.MANAGER]}>
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },

      // Report (owner only)
      {
        path: "report",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.OWNER]}>
            <ReportPage />
          </ProtectedRoute>
        ),
      },

      // Chat (all roles)
      {
        path: "chat",
        element: (
          <ProtectedRoute
            allowedRoles={[ROLES.OWNER, ROLES.MANAGER, ROLES.SELLER]}
          >
            <ChatPage />
          </ProtectedRoute>
        ),
      },

      // Setting (owner only)
      {
        path: "setting",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.OWNER]}>
            <SettingPage />
          </ProtectedRoute>
        ),
      },

      // Setting2 ( seller and manager )
      {
        path: "setting2",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.SELLER]}>
            <AdminSetting2 />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Fallback
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
