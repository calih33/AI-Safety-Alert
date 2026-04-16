import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { fetchTickets } from "../services/tickets";
import TicketStatusBadge from "../components/TicketStatus";
import type { Ticket } from "../types/tickets";
import { Clock, Wrench } from "lucide-react";

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        async function load() {
            try {
                const data = (await fetchTickets()) as Ticket[];
                const sorted = data.sort((a: Ticket, b: Ticket) => {
                    if (b.priority !== a.priority) return Number(b.priority) - Number(a.priority);
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                setTickets(sorted);
            } catch (err) {
                console.error("Fetch failed", err);
            }
        }
        load();
    }, []);

    return (
        <div className="min-h-screen bg-[#f7f7fb]">
            <div className="hidden md:flex min-h-screen p-4 gap-4 w-full">
                <Sidebar userName={user.name || "Student"} activePage="tickets" isMenuOpen={isMenuOpen} />

                <div className="flex-1 min-w-0 bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm transition-all duration-300">
                    <Navbar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} isSidebarOpen={isMenuOpen} />
                    <main className="pt-6">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6">My Reports</h2>
                        {tickets.length === 0 ? (
                            <div className="rounded-2xl bg-[#f6f7fb] p-8 text-center text-gray-500">
                                No tickets found.
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="bg-[#f6f7fb] p-5 rounded-2xl flex flex-col border border-transparent hover:border-gray-200 transition"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 w-full">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <h3 className="font-medium text-gray-900 text-lg">{ticket.title}</h3>
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${Number(ticket.priority) >= 3
                                                            ? "bg-red-100 text-red-800 border-red-200"
                                                            : Number(ticket.priority) === 2
                                                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                                : "bg-gray-200 text-gray-700 border-gray-300"
                                                            }`}
                                                    >
                                                        PRIORITY {ticket.priority}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-3">{ticket.content}</p>

                                                <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-gray-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(ticket.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Wrench className="w-3.5 h-3.5" />
                                                        Routed to:
                                                        <span className="text-gray-700 uppercase">
                                                            {ticket.department?.name || "Assessing..."}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="shrink-0 mt-2 md:mt-0">
                                                <TicketStatusBadge status={ticket.status} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}