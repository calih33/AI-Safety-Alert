import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ShieldAlert, Clock3, Building2, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import type { Ticket } from "../types/tickets";

//Temporary mock ticket data for dashboard UI 
const mockTickets: Ticket[] = [
  {
    id: 1,
    title: "Broken glass near lobby",
    content: "There is broken glass near the south lobby entrance.",
    status: "needs-attention",
    priority: 8,
    created_at: "2026-04-15T10:30:00",
    updated_at: "2026-04-15T10:30:00",
    ai_summary: "Broken glass hazard near entrance. Needs quick cleanup.",
    location: {
      building_prefix: "SW",
      room_number: "101",
    },
    department: {
      id: 1,
      name: "Janitorial",
    },
  },
  {
    id: 2,
    title: "Wet floor in hallway",
    content: "There is a spill in the hallway beside the lab.",
    status: "in-progress",
    priority: 6,
    created_at: "2026-04-15T09:00:00",
    updated_at: "2026-04-15T09:00:00",
    ai_summary: "Slip hazard reported in hallway. Staff may already be handling it.",
    location: {
      building_prefix: "SE",
      room_number: "204",
    },
    department: {
      id: 2,
      name: "Maintenance",
    },
  },
  {
    id: 3,
    title: "Exposed wire in classroom",
    content: "A wire is hanging from the wall near the projector.",
    status: "resolved",
    priority: 9,
    created_at: "2026-04-14T15:20:00",
    updated_at: "2026-04-14T15:20:00",
    ai_summary: "Possible electrical hazard reported in classroom.",
    location: {
      building_prefix: "NW",
      room_number: "305",
    },
    department: {
      id: 3,
      name: "IT",
    },
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  //For now this uses mock ticket data.
  const [tickets] = useState<Ticket[]>(mockTickets);

  //Controls whether the sidebar is open or closed
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  //Stores the text typed in search bar
  const [search, setSearch] = useState("");

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

  // Filters tickets based on the search input
  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase();

    // If search is empty, show all tickets
    if (!term) {
      return tickets;
    }

    // Return only tickets that match the search text
    return tickets.filter((ticket) => {
      const location =
        `${ticket.location?.building_prefix ?? ""} ${ticket.location?.room_number ?? ""}`.toLowerCase();

      return (
        ticket.title.toLowerCase().includes(term) ||
        ticket.content.toLowerCase().includes(term) ||
        ticket.status.toLowerCase().includes(term) ||
        String(ticket.priority).includes(term) ||
        (ticket.ai_summary ?? "").toLowerCase().includes(term) ||
        (ticket.department?.name ?? "").toLowerCase().includes(term) ||
        location.includes(term)
      );
    });
  }, [tickets, search]);

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

  // Returns different badge colors depending on the ticket status
  function getStatusClasses(status: Ticket["status"]) {
    switch (status) {
      case "needs-attention":
        return "bg-red-100 text-red-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // Combines building and room into one location string
  function formatLocation(ticket: Ticket) {
    const building = ticket.location?.building_prefix ?? "";
    const room = ticket.location?.room_number ?? "";
    return `${building} ${room}`.trim() || "No location";
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
                      placeholder="Search your reports..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
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

              {/* Desktop ticket cards section */}
              <div className="rounded-[28px] bg-[#f6f7fb] p-4 lg:p-6">
                {/* Section title */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Your Reports
                </h3>

                {/* If no tickets match the search, show empty state */}
                {filteredTickets.length === 0 ? (
                  <div className="rounded-[24px] bg-white border border-gray-100 p-6 text-gray-500">
                    No reports found.
                  </div>
                ) : (
                  // Show the cards in a responsive grid
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-[24px] bg-white border border-gray-100 p-5"
                      >
                        {/* Top row of the card */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            {/* Ticket title */}
                            <h4 className="text-lg font-semibold text-gray-900">
                              {ticket.title}
                            </h4>
                          </div>

                          {/* Status badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(ticket.status)}`}
                          >
                            {ticket.status}
                          </span>
                        </div>

                        {/* Ticket details */}
                        <div className="space-y-3 text-sm text-gray-700">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">Location:</span> {formatLocation(ticket)}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">Priority:</span> {ticket.priority}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">Department:</span>{" "}
                              {ticket.department?.name ?? "Pending"}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Clock3 className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">Submitted:</span>{" "}
                              {new Date(ticket.created_at).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">Issue:</span> {ticket.content}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">AI Summary:</span>{" "}
                              {ticket.ai_summary ?? "Not available yet"}
                            </p>
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
                    placeholder="Search your reports..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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

              {/* Mobile ticket cards section */}
              <div className="rounded-[24px] bg-[#f6f7fb] p-4">
                {/* Section title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Reports
                </h3>

                {/* Empty state if no tickets are found */}
                {filteredTickets.length === 0 ? (
                  <div className="rounded-[20px] bg-white border border-gray-100 p-4 text-gray-500">
                    No reports found.
                  </div>
                ) : (
                  /* One card per row on mobile */
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-[20px] bg-white border border-gray-100 p-4"
                      >
                        {/* Top part of the card */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">

                            {/* Title row with icon */}
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-semibold text-gray-900 break-words">
                                {ticket.title}
                              </h4>
                            </div>

                            {/* Location row with icon */}
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                              <p className="text-sm text-gray-500 break-words">
                                {formatLocation(ticket)}
                              </p>
                            </div>
                          </div>

                          {/* Status badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClasses(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>
                        </div>

                        {/* Ticket details with icons */}
                        <div className="space-y-3 text-sm text-gray-700">
                          <div className="flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">Priority:</span> {ticket.priority}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">Department:</span>{" "}
                              {ticket.department?.name ?? "Pending"}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Clock3 className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">Submitted:</span>{" "}
                              {new Date(ticket.created_at).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">Issue:</span> {ticket.content}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                            <p>
                              <span className="font-medium">AI Summary:</span>{" "}
                              {ticket.ai_summary ?? "Not available yet"}
                            </p>
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
    </div>
  );
}