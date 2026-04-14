import { Link } from "react-router-dom";

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
  if (!isMenuOpen) return null;

  function renderLinks() {
    return (
      <div className="bg-[#f6f7fb] rounded-[28px] p-4 space-y-3">
        <Link
          to="/dashboard"
          className={`block rounded-2xl px-4 py-3 text-sm transition ${
            activePage === "dashboard"
              ? "bg-white font-medium text-gray-900 shadow-sm"
              : "text-gray-600 hover:bg-white/70"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/tickets"
          className={`block rounded-2xl px-4 py-3 text-sm transition ${
            activePage === "tickets"
              ? "bg-white font-medium text-gray-900 shadow-sm"
              : "text-gray-600 hover:bg-white/70"
          }`}
        >
          My Tickets
        </Link>

        <Link
          to="/tickets/report"
          className={`block rounded-2xl px-4 py-3 text-sm transition ${
            activePage === "report"
              ? "bg-white font-medium text-gray-900 shadow-sm"
              : "text-gray-600 hover:bg-white/70"
          }`}
        >
          Report Ticket
        </Link>

        <Link
          to="/settings"
          className={`block rounded-2xl px-4 py-3 text-sm transition ${
            activePage === "settings"
              ? "bg-white font-medium text-gray-900 shadow-sm"
              : "text-gray-600 hover:bg-white/70"
          }`}
        >
          Settings
        </Link>
      </div>
    );
  }

  return (
    <>
      <aside className="hidden md:block w-72 shrink-0 bg-white rounded-[32px] border border-gray-100 p-6">
        <div className="mb-10">
          <div className="text-2xl font-bold text-gray-900 mt-3 ml-3">
            Good Evening
          </div>
          <p className="text-sm text-gray-500 mt-3 ml-3">{userName}</p>
        </div>

        {renderLinks()}
      </aside>

      <aside className="md:hidden fixed inset-0 z-50 bg-white p-5 overflow-y-auto">
        <div className="mb-10">
          <div className="text-2xl font-bold text-gray-900 mt-3 ml-3">
            Good Evening
          </div>
          <p className="text-sm text-gray-500 mt-3 ml-3">{userName}</p>
        </div>

        {renderLinks()}
      </aside>
    </>
  );
}