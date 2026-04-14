import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import type { Ticket } from "../types/tickets";

export default function DashboardPage() {
  const navigate = useNavigate();

  // Stores all ticket data
  const [tickets] = useState<Ticket[]>([]);

  // Controls whether the sidebar is open or closed
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // Protects the page so only logged in users can access it
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Gets the logged in user's name from localStorage
  const userName = (() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return "Student";
    }

    try {
      const user = JSON.parse(storedUser);
      return user?.name || "Student";
    } catch {
      return "Student";
    }
  })();

  // Computes the values for the dashboard stat cards
  const stats = useMemo(() => {
    return {
      total: tickets.length,
      attention: tickets.filter((t) => t.status === "needs-attention").length,
      progress: tickets.filter((t) => t.status === "in-progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
    };
  }, [tickets]);

  // Opens or closes the sidebar menu
  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  

  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      {/* DESKTOP VIEW */}
      <div className="hidden md:flex min-h-screen p-4 gap-4">
              <Sidebar
        userName={userName}
        activePage="dashboard"
        isMenuOpen={isMenuOpen}
      />

        {/* Desktop main content area */}
        <div className="flex-1 min-w-0 bg-[#f7f7fb] rounded-[32px]">
          <div className="bg-white rounded-[32px] min-h-full p-5 lg:p-6">
            {/* Navbar contains the hamburger menu button */}
            <Navbar
              appName="Campus Ticketing System"
              onMenuClick={toggleMenu}
              isSidebarOpen={isMenuOpen}
            />

            <main className="pt-6">
              {/* Top section: search bar + report button */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
                {/* Search bar */}
                <div className="w-full max-w-md">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search here..."
                      className="w-full rounded-full bg-[#f6f7fb] border border-transparent pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>

                {/* Button that goes to report ticket page */}
                <Link
                  to="/tickets/report"
                  className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-800 whitespace-nowrap"
                >
                  Report New Ticket
                </Link>
              </div>

              {/* Dashboard section */}
              <div className="rounded-[28px] bg-[#f6f7fb] p-4 lg:p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-3xl font-semibold text-gray-900">
                    Dashboard
                  </h2>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
                  <div className="rounded-[28px] bg-[#f8e7ea] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600">All Tickets</div>
                    <div className="text-5xl font-semibold text-gray-900">
                      {stats.total}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-[#f5eed6] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600">Needs Attention</div>
                    <div className="text-5xl font-semibold text-gray-900">
                      {stats.attention}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-[#e8f2df] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600">In Progress</div>
                    <div className="text-5xl font-semibold text-gray-900">
                      {stats.progress}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-[#dff0f7] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600">Resolved</div>
                    <div className="text-5xl font-semibold text-gray-900">
                      {stats.resolved}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden min-h-screen bg-[#f7f7fb] p-3">
        <div className="bg-white rounded-[28px] min-h-screen overflow-hidden">
          {/* Navbar with hamburger menu button for mobile */}
          <Navbar
            appName="Campus Ticketing System"
            onMenuClick={toggleMenu}
            isSidebarOpen={isMenuOpen}
          />

          <div className="flex">
            {/* Mobile sidebar overlay */}
           <Sidebar
  userName={userName}
  activePage="dashboard"
  isMenuOpen={isMenuOpen}

/>

            {/* Mobile main content */}
            <main className="flex-1 min-w-0 p-4">
              {/* Mobile top section */}
              <div className="space-y-4 mb-5">
                {/* Mobile search bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="w-full rounded-full bg-[#f6f7fb] border border-transparent pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                {/* Mobile report button */}
                <Link
                  to="/tickets/report"
                  className="block w-full text-center rounded-2xl bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-800"
                >
                  Report New Ticket
                </Link>
              </div>

              {/* Mobile dashboard stats */}
              <div className="rounded-[24px] bg-[#f6f7fb] p-4 mb-5">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Dashboard
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-[24px] bg-[#f8e7ea] p-5">
                    <div className="text-sm text-gray-600 mb-2">All Tickets</div>
                    <div className="text-4xl font-semibold text-gray-900">
                      {stats.total}
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#f5eed6] p-5">
                    <div className="text-sm text-gray-600 mb-2">
                      Needs Attention
                    </div>
                    <div className="text-4xl font-semibold text-gray-900">
                      {stats.attention}
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#e8f2df] p-5">
                    <div className="text-sm text-gray-600 mb-2">In Progress</div>
                    <div className="text-4xl font-semibold text-gray-900">
                      {stats.progress}
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#dff0f7] p-5">
                    <div className="text-sm text-gray-600 mb-2">Resolved</div>
                    <div className="text-4xl font-semibold text-gray-900">
                      {stats.resolved}
                    </div>
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