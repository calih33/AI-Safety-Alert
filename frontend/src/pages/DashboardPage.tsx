import {useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";
import type { Ticket } from "../types/tickets";

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || "Student";


  const stats = useMemo(() => {
    return {
      total: tickets.length,
      attention: tickets.filter((t) => t.status === "needs-attention").length,
      progress: tickets.filter((t) => t.status === "in-progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
    };
  }, [tickets]);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function renderMenu() {
    return (
      <>
        <div className="mb-10">
          <div className="text-2xl font-bold text-gray-900 mb-3">
            Good Evening
          </div>
          <p className="text-sm text-gray-500">{userName}</p>
        </div>

        <div className="bg-[#f6f7fb] rounded-[28px] p-4 space-y-3">
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm">
            Dashboard
          </div>

          <div className="rounded-2xl px-4 py-3 text-sm text-gray-600">
            My Tickets
          </div>

          <Link
            to="/tickets/report"
            className="block rounded-2xl px-4 py-3 text-sm text-gray-600"
            onClick={closeMenu}
          >
            Report Ticket
          </Link>

          <div className="rounded-2xl px-4 py-3 text-sm text-gray-600">
            Settings
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      <div className="hidden md:flex min-h-screen p-4 gap-4">
  {isMenuOpen && (
    <aside className="w-72 shrink-0 bg-white rounded-[32px] border border-gray-100 p-6">
      {renderMenu()}
    </aside>
  )}

        <div className="flex-1 min-w-0 bg-[#f7f7fb] rounded-[32px]">
          <div className="bg-white rounded-[32px] min-h-full p-5 lg:p-6">
            <Navbar
              appName="Campus Ticketing System"
              onMenuClick={toggleMenu}
            />

            <main className="pt-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
                <div className="w-full max-w-md">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search here..."
                      className="w-full rounded-full bg-[#f6f7fb] border border-transparent pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>

                <Link
                  to="/tickets/report"
                  className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-800 whitespace-nowrap"
                >
                  Report New Ticket
                </Link>
              </div>

              <div className="rounded-[28px] bg-[#f6f7fb] p-4 lg:p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-3xl font-semibold text-gray-900">Dashboard</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
                  <div className="rounded-[28px] bg-[#f8e7ea] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600">All Tickets</div>
                    <div className="text-5xl font-semibold text-gray-900">{stats.total}</div>
                  </div>

                  <div className="rounded-[28px] bg-[#f5eed6] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600">Needs Attention</div>
                    <div className="text-5xl font-semibold text-gray-900">{stats.attention}</div>
                  </div>

                  <div className="rounded-[28px] bg-[#e8f2df] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600">In Progress</div>
                    <div className="text-5xl font-semibold text-gray-900">{stats.progress}</div>
                  </div>

                  <div className="rounded-[28px] bg-[#dff0f7] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600">Resolved</div>
                    <div className="text-5xl font-semibold text-gray-900">{stats.resolved}</div>
                  </div>
                </div>
              </div>

            </main>
          </div>
        </div>
      </div>

// Mobile View
      <div className="md:hidden min-h-screen bg-[#f7f7fb] p-3">
        <div className="bg-white rounded-[28px] min-h-screen overflow-hidden">
          <Navbar
            appName="Campus Ticketing System"
            onMenuClick={toggleMenu}
          />

          <div className="flex">
           {isMenuOpen && (
  <aside className="fixed inset-0 z-50 bg-white p-5 overflow-y-auto">
    {renderMenu()}
  </aside>
)}

            <main className="flex-1 min-w-0 p-4">
              <div className="space-y-4 mb-5">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search here..."
                    className="w-full rounded-full bg-[#f6f7fb] border border-transparent pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <Link
                  to="/tickets/report"
                  className="block w-full text-center rounded-2xl bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-800"
                >
                  Report New Ticket
                </Link>
              </div>

              <div className="rounded-[24px] bg-[#f6f7fb] p-4 mb-5">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard</h2>

                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-[24px] bg-[#f8e7ea] p-5">
                    <div className="text-sm text-gray-600 mb-2">All Tickets</div>
                    <div className="text-4xl font-semibold text-gray-900">{stats.total}</div>
                  </div>

                  <div className="rounded-[24px] bg-[#f5eed6] p-5">
                    <div className="text-sm text-gray-600 mb-2">Needs Attention</div>
                    <div className="text-4xl font-semibold text-gray-900">{stats.attention}</div>
                  </div>

                  <div className="rounded-[24px] bg-[#e8f2df] p-5">
                    <div className="text-sm text-gray-600 mb-2">In Progress</div>
                    <div className="text-4xl font-semibold text-gray-900">{stats.progress}</div>
                  </div>

                  <div className="rounded-[24px] bg-[#dff0f7] p-5">
                    <div className="text-sm text-gray-600 mb-2">Resolved</div>
                    <div className="text-4xl font-semibold text-gray-900">{stats.resolved}</div>
                  </div>
                </div>
              </div>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
}