import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"; import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ReportTicket from "./pages/ReportTicket";
import MyTicketsPage from "./pages/MyTicketsPage";
import SettingsPage from "./pages/SettingsPage";

function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-[#f7f7fb]">
      <Outlet />
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/tickets", element: <MyTicketsPage /> },
      { path: "/tickets/report", element: <ReportTicket /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> }
]);