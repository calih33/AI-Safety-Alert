import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  FilePlus,
  Settings,
  ShieldAlert,
  LogOut
} from "lucide-react";

interface SidebarProps {
  userName: string;
  activePage: "dashboard" | "report" | "tickets" | "settings";
  isMenuOpen: boolean;
}

export default function Sidebar({
  userName,
  activePage,
  isMenuOpen,
}: SidebarProps) {
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const isAdmin = user.email === 'admin@bcit.ca';

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (!isMenuOpen) return null;

  function renderLinks() {
    return (
      <div className="bg-[#f6f7fb] rounded-[28px] p-4 flex flex-col gap-1.5">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${activePage === "dashboard"
              ? "bg-white font-medium text-gray-900 shadow-sm"
              : "text-gray-500 hover:bg-white/60 hover:text-gray-900"
            }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${activePage === 'dashboard' ? 'text-gray-900' : 'text-gray-400'}`} />
          Dashboard
        </Link>

        <Link
          to="/tickets"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${activePage === "tickets"
              ? "bg-white font-medium text-gray-900 shadow-sm"
              : "text-gray-500 hover:bg-white/60 hover:text-gray-900"
            }`}
        >
          <Ticket className={`w-5 h-5 ${activePage === 'tickets' ? 'text-gray-900' : 'text-gray-400'}`} />
          My Tickets
        </Link>

        <Link
          to="/tickets/report"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${activePage === "report"
              ? "bg-white font-medium text-gray-900 shadow-sm"
              : "text-gray-500 hover:bg-white/60 hover:text-gray-900"
            }`}
        >
          <FilePlus className={`w-5 h-5 ${activePage === 'report' ? 'text-gray-900' : 'text-gray-400'}`} />
          Report Ticket
        </Link>

        <Link
          to="/settings"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${activePage === "settings"
              ? "bg-white font-medium text-gray-900 shadow-sm"
              : "text-gray-500 hover:bg-white/60 hover:text-gray-900"
            }`}
        >
          <Settings className={`w-5 h-5 ${activePage === 'settings' ? 'text-gray-900' : 'text-gray-400'}`} />
          Settings
        </Link>

        {}
        {isAdmin && (
          <>
            <div className="h-px bg-gray-200/60 my-2 mx-4"></div>
            <a
              href="http://127.0.0.1:8000/admin/dashboard"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Admin Panel
            </a>
          </>
        )}

        {}
        <div className={`h-px bg-gray-200/60 mx-4 ${isAdmin ? 'my-1' : 'my-2'}`}></div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      {}
      <aside className="hidden md:flex flex-col w-[280px] shrink-0 bg-white rounded-[32px] border border-gray-100 p-5 shadow-sm">
        <div className="mb-6 px-4 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Campus Portal</p>
          <div className="text-xl font-bold text-gray-900 truncate">
            {userName}
          </div>
        </div>
        {renderLinks()}
      </aside>

      {}
      <aside className="md:hidden fixed inset-0 z-50 bg-white p-5 overflow-y-auto">
        <div className="mb-8 px-4 pt-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Campus Portal</p>
          <div className="text-2xl font-bold text-gray-900 truncate">
            {userName}
          </div>
        </div>
        {renderLinks()}
      </aside>
    </>
  );
}