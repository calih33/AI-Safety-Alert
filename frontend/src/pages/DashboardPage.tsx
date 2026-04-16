import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ShieldAlert,
  Clock3,
  Building2,
  FileText
} from "lucide-react"; // Added icons for the card layout
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import type { Ticket } from "../types/tickets";
import { fetchTickets } from "../services/tickets";

export default function DashboardPage() {
  const navigate = useNavigate();

  // 1. Real State: Stores the physical reports from your database
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [search, setSearch] = useState(""); // Search state from the structure you liked

  // 2. Fetch Logic: Keeps the page protected and loads real data
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTickets();
        setTickets(data);
      } catch (e) {
        console.error("Dashboard load failed", e);
      }
    };
    load();
  }, []);

  const userName = (() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "Student";
    try {
      const user = JSON.parse(storedUser);
      return user?.name || "Student";
    } catch { return "Student"; }
  })();

  // 3. The Filter Engine: Searches real titles, content, and departments
  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tickets;

    return tickets.filter((ticket) => {
      return (
        ticket.title.toLowerCase().includes(term) ||
        ticket.content.toLowerCase().includes(term) ||
        (ticket.department?.name ?? "").toLowerCase().includes(term)
      );
    });
  }, [tickets, search]);

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

  // 4. Visual Helpers: For the grounded, physical look of the cards
  function getStatusClasses(status: Ticket["status"]) {
    switch (status) {
      case "needs-attention": return "bg-red-100 text-red-700 border-red-200";
      case "in-progress": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "resolved": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      <div className="hidden md:flex min-h-screen p-4 gap-4">
        <Sidebar userName={userName} activePage="dashboard" isMenuOpen={isMenuOpen} />

        <div className="flex-1 min-w-0 bg-[#f7f7fb] rounded-[32px]">
          <div className="bg-white rounded-[32px] min-h-full p-5 lg:p-6 shadow-sm border border-gray-100">
            <Navbar appName="Campus Ticketing System" onMenuClick={toggleMenu} isSidebarOpen={isMenuOpen} />

            <main className="pt-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
                <div className="w-full max-w-md">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search your reports..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-full bg-[#f6f7fb] border border-transparent pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>

                <Link to="/tickets/report" className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-800 transition">
                  Report New Ticket
                </Link>
              </div>

              {/* Stat cards section */}
              <div className="rounded-[28px] bg-[#f6f7fb] p-4 lg:p-6 mb-6">
                <h2 className="text-3xl font-semibold text-gray-900 mb-5">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
                  <div className="rounded-[28px] bg-[#f8e7ea] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600 font-medium">All Tickets</div>
                    <div className="text-5xl font-semibold text-gray-900">{stats.total}</div>
                  </div>
                  <div className="rounded-[28px] bg-[#f5eed6] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600 font-medium">Needs Attention</div>
                    <div className="text-5xl font-semibold text-gray-900">{stats.attention}</div>
                  </div>
                  <div className="rounded-[28px] bg-[#e8f2df] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600 font-medium">In Progress</div>
                    <div className="text-5xl font-semibold text-gray-900">{stats.progress}</div>
                  </div>
                  <div className="rounded-[28px] bg-[#dff0f7] p-6 min-h-[150px] flex flex-col justify-between">
                    <div className="text-sm text-gray-600 font-medium">Resolved</div>
                    <div className="text-5xl font-semibold text-gray-900">{stats.resolved}</div>
                  </div>
                </div>
              </div>

              {/* 5. The Card Structure: Real Data Card Display */}
              <div className="rounded-[28px] bg-[#f6f7fb] p-4 lg:p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your Recent Reports</h3>

                {filteredTickets.length === 0 ? (
                  <div className="rounded-[24px] bg-white border border-gray-100 p-8 text-center text-gray-500 italic">
                    No matching reports found in the system.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredTickets.map((ticket) => (
                      <div key={ticket.id} className="rounded-[24px] bg-white border border-gray-100 p-5 shadow-sm hover:border-gray-200 transition">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <h4 className="text-lg font-bold text-gray-900">{ticket.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusClasses(ticket.status)}`}>
                            {ticket.status.replace('-', ' ')}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm text-gray-700">
                          <div className="flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                            <p><span className="font-bold text-gray-500">PRIORITY:</span> {ticket.priority}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                            <p><span className="font-bold text-gray-500">DEPT:</span> {ticket.department?.name || "Assessing..."}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock3 className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                            <p><span className="font-bold text-gray-500">REPORTED:</span> {new Date(ticket.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex items-start gap-2 pt-2 border-t border-gray-50">
                            <FileText className="w-4 h-4 mt-1 text-gray-400 shrink-0" />
                            <p className="leading-relaxed">{ticket.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
      {/* Note: Ensure your mobile view (hidden in this snippet) follows this same filteredTickets.map logic */}
    </div>
  );
}