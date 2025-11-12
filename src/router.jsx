
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";

// Dashboard Pages
import DashboardPage from "./pages/DashboardPage";
import SalePage from "./pages/SalePage";
import GoldManagementPage from "./pages/GoldManagementPage";
import SettingPage from "./pages/SettingPage";
import Setting2Page from "./pages/SettingPage2"
import UserManagementPage from "./pages/UserManagementPage";
import ReportPage from "./pages/ReportPage";
import ChatPage from "./pages/ChatPage";

// Auth Pages
import LoginPage from "./pages/LoginPage";

import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "./roles";

const currentUser = { role: localStorage.getItem("adminRole") || null };

const router = createBrowserRouter([
  // Auth routes
  { path: "/login", element: <LoginPage /> },

  // Main dashboard routes
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      // Dashboard (owner only)
      {
        index: true,
        element: (
          <ProtectedRoute userRole={currentUser.role} allowedRoles={[ROLES.OWNER]}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },

      // Sale (all roles)
      {
        path: "sale",
        element: (
          <ProtectedRoute
            userRole={currentUser.role}
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
          <ProtectedRoute
            userRole={currentUser.role}
            allowedRoles={[ROLES.OWNER, ROLES.MANAGER]}
          >
            <GoldManagementPage />
          </ProtectedRoute>
        ),
      },

      // User Management (owner + manager)
      {
        path: "user-management",
        element: (
          <ProtectedRoute
            userRole={currentUser.role}
            allowedRoles={[ROLES.OWNER, ROLES.MANAGER]}
          >
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },

      // Report (owner only)
      {
        path: "report",
        element: (
          <ProtectedRoute userRole={currentUser.role} allowedRoles={[ROLES.OWNER]}>
            <ReportPage />
          </ProtectedRoute>
        ),
      },

      // Chat (all roles)
      {
        path: "chat",
        element: (
          <ProtectedRoute
            userRole={currentUser.role}
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
          <ProtectedRoute userRole={currentUser.role} allowedRoles={[ROLES.OWNER]}>
            <SettingPage />
          </ProtectedRoute>
        ),
      },

      // Setting2 ( seller and manager )
      {
        path: "setting2",
        element: (
          <ProtectedRoute userRole={currentUser.role} allowedRoles={[ROLES.MANAGER, ROLES.SELLER]}>
            <Setting2Page />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Fallback
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
