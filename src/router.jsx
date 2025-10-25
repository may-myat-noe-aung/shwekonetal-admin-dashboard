import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/DashboardPage";
import SalePage from "./pages/SalePage";
import GoldManagementPage from "./pages/GoldManagementPage";
import SettingPage from "./pages/SettingPage";
import UserManagementPage from "./pages/UserManagementPage";
import ReportPage from "./pages/ReportPage";
import ChatPage from "./pages/ChatPage";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <DashboardPage />,
      },
        {
        path: "/sale",
        element: <SalePage />,
      },
      ,
        {
        path: "/gold-management",
        element: <GoldManagementPage />,
      },
      ,
        {
        path: "/user-management",
        element: <UserManagementPage />,
      },
          {
        path: "/report",
        element: <ReportPage />,
      },
          {
        path: "/chat",
        element: <ChatPage />,
      },
      ,
        {
        path: "/setting",
        element: <SettingPage />,
      },
    
     
    ],
  },
]);

export default router;
