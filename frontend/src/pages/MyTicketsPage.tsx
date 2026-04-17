import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { deleteTicket, fetchTickets, updateTicket } from "../services/tickets";
import TicketStatusBadge from "../components/TicketStatus";
import type { Ticket } from "../types/tickets";
import { Clock, PencilLine, Trash2, X, Wrench } from "lucide-react";

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteConfirmTicket, setDeleteConfirmTicket] = useState<Ticket | null>(null);
    const [editForm, setEditForm] = useState({
        title: "",
        content: "",
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const sortedTickets = useMemo(() => {
        return [...tickets].sort((a: Ticket, b: Ticket) => {
            if (b.priority !== a.priority) return Number(b.priority) - Number(a.priority);
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }, [tickets]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");
            try {
                const data = (await fetchTickets()) as Ticket[];
                setTickets(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load tickets.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    function openTicket(ticket: Ticket) {
        setSelectedTicket(ticket);
        setEditForm({
            title: ticket.title,
            content: ticket.content,
        });
        setIsEditing(false);
    }

    function closeTicket() {
        if (saving || deletingId !== null || deleteConfirmTicket) return;
        setSelectedTicket(null);
        setIsEditing(false);
    }

    function startEdit() {
        if (!selectedTicket) return;
        setEditForm({
            title: selectedTicket.title,
            content: selectedTicket.content,
        });
        setIsEditing(true);
    }

    async function handleSave() {
        if (!selectedTicket) return;

        setSaving(true);
        setError("");

        try {
            const updated = await updateTicket(selectedTicket.id, {
                title: editForm.title,
                content: editForm.content,
            });
            setTickets((current) => current.map((ticket) => (ticket.id === selectedTicket.id ? updated : ticket)));
            setSelectedTicket(updated);
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update ticket.");
        } finally {
            setSaving(false);
        }
    }

    function promptDelete() {
        if (!selectedTicket) return;
        setDeleteConfirmTicket(selectedTicket);
    }

    async function handleConfirmDelete() {
        if (!deleteConfirmTicket) return;

        const ticketId = deleteConfirmTicket.id;
        setDeletingId(ticketId);
        setError("");

        try {
            await deleteTicket(ticketId);
            setTickets((current) => current.filter((ticket) => ticket.id !== ticketId));
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(null);
                setIsEditing(false);
            }
            setDeleteConfirmTicket(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete ticket.");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f6f7fb_40%,_#eef1f7_100%)]">
            <div className="hidden md:flex min-h-screen p-4 gap-4 w-full">
                <Sidebar userName={user.name || "Student"} activePage="tickets" isMenuOpen={isMenuOpen} />

                <div className="flex-1 min-w-0 bg-white rounded-[32px] p-6 border border-gray-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300">
                    <Navbar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} isSidebarOpen={isMenuOpen} />
                    <main className="pt-6">
                        <div className="flex items-end justify-between gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Main <span className="mx-2">»</span> My Reports</p>
                                <h2 className="text-3xl font-semibold text-gray-900">My Reports</h2>
                            </div>
                            <div className="rounded-2xl bg-[#f6f7fb] px-4 py-3 text-sm text-gray-600 border border-gray-100">
                                {sortedTickets.length} ticket{sortedTickets.length === 1 ? "" : "s"}
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid gap-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="rounded-2xl bg-[#f6f7fb] border border-gray-100 p-5 animate-pulse">
                                        <div className="h-5 w-2/3 rounded bg-gray-200 mb-3" />
                                        <div className="h-4 w-full rounded bg-gray-200 mb-2" />
                                        <div className="h-4 w-5/6 rounded bg-gray-200 mb-4" />
                                        <div className="h-4 w-1/3 rounded bg-gray-200" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                                <p className="font-medium mb-1">Could not load your tickets.</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : sortedTickets.length === 0 ? (
                            <div className="rounded-2xl bg-[#f6f7fb] p-8 text-center text-gray-500 border border-dashed border-gray-200">
                                <p className="font-medium text-gray-700 mb-1">No tickets yet.</p>
                                <p className="text-sm mb-4">Submit a report to see it here with status, routing, and AI summary.</p>
                                <a href="/tickets/report" className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-800 transition">
                                    Report a Ticket
                                </a>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {sortedTickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="bg-[#f6f7fb] p-5 rounded-2xl flex flex-col border border-transparent hover:border-gray-200 transition cursor-pointer"
                                        onClick={() => openTicket(ticket)}
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

            <div className="md:hidden min-h-screen p-3">
                <div className="bg-white rounded-[28px] min-h-screen overflow-hidden border border-gray-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <Navbar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} isSidebarOpen={isMenuOpen} />
                    <Sidebar userName={user.name || "Student"} activePage="tickets" isMenuOpen={isMenuOpen} />

                    <main className="p-4 pt-6">
                        <div className="flex items-end justify-between gap-3 mb-5">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Main » My Reports</p>
                                <h2 className="text-2xl font-semibold text-gray-900">My Reports</h2>
                            </div>
                            <div className="rounded-2xl bg-[#f6f7fb] px-3 py-2 text-xs text-gray-600 border border-gray-100">
                                {sortedTickets.length}
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid gap-3">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="rounded-2xl bg-[#f6f7fb] border border-gray-100 p-4 animate-pulse">
                                        <div className="h-5 w-2/3 rounded bg-gray-200 mb-2" />
                                        <div className="h-4 w-full rounded bg-gray-200 mb-2" />
                                        <div className="h-4 w-1/2 rounded bg-gray-200" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                                {error}
                            </div>
                        ) : sortedTickets.length === 0 ? (
                            <div className="rounded-2xl bg-[#f6f7fb] p-6 text-center text-gray-500 border border-dashed border-gray-200">
                                <p className="font-medium text-gray-700 mb-1">No tickets yet.</p>
                                <a href="/tickets/report" className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition mt-3">
                                    Report a Ticket
                                </a>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {sortedTickets.map((ticket) => (
                                    <button
                                        key={ticket.id}
                                        type="button"
                                        onClick={() => openTicket(ticket)}
                                        className="text-left rounded-2xl bg-[#f6f7fb] p-4 border border-transparent hover:border-gray-200 transition"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h3 className="font-medium text-gray-900 text-base">{ticket.title}</h3>
                                            <TicketStatusBadge status={ticket.status} />
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{ticket.content}</p>
                                        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="uppercase text-gray-700">{ticket.department?.name || "Assessing..."}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {selectedTicket && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-3 md:p-6">
                    <div className="w-full max-w-3xl rounded-[28px] bg-white shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Ticket Details</p>
                                <h3 className="text-xl font-semibold text-gray-900">{selectedTicket.title}</h3>
                            </div>
                            <button onClick={closeTicket} className="p-2 rounded-full hover:bg-gray-100" disabled={saving || deletingId !== null}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-[1.3fr_0.7fr] gap-0">
                            <div className="p-5 md:p-6 border-b md:border-b-0 md:border-r border-gray-100">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ticket-title">Title</label>
                                            <input
                                                id="ticket-title"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                                                className="w-full rounded-2xl bg-[#f6f7fb] border border-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ticket-content">Details</label>
                                            <textarea
                                                id="ticket-content"
                                                value={editForm.content}
                                                onChange={(e) => setEditForm((prev) => ({ ...prev, content: e.target.value }))}
                                                className="w-full min-h-40 rounded-[24px] bg-[#f6f7fb] border border-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-4">
                                            <TicketStatusBadge status={selectedTicket.status} />
                                            <span className="text-sm text-gray-500">Priority {selectedTicket.priority}</span>
                                        </div>
                                        <p className="text-gray-700 leading-7 whitespace-pre-line mb-6">{selectedTicket.content}</p>
                                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-2xl bg-[#f6f7fb] p-4">
                                                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Routed to</p>
                                                <p className="font-medium text-gray-900">{selectedTicket.department?.name || "Assessing..."}</p>
                                            </div>
                                            <div className="rounded-2xl bg-[#f6f7fb] p-4">
                                                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Location</p>
                                                <p className="font-medium text-gray-900">{selectedTicket.location?.building_prefix || "N/A"}</p>
                                            </div>
                                            <div className="rounded-2xl bg-[#f6f7fb] p-4">
                                                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Created</p>
                                                <p className="font-medium text-gray-900">{new Date(selectedTicket.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                                            </div>
                                            <div className="rounded-2xl bg-[#f6f7fb] p-4">
                                                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Updated</p>
                                                <p className="font-medium text-gray-900">{new Date(selectedTicket.updated_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-5 md:p-6 bg-[#fafbfc]">
                                <div className="rounded-2xl bg-white border border-gray-100 p-4 mb-4">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Clock className="w-4 h-4" /> Activity</div>
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex items-start gap-3">
                                            <Wrench className="w-4 h-4 mt-0.5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">AI routed</p>
                                                <p>{selectedTicket.department?.name || "Assessment in progress"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-4 h-4 mt-0.5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">Reported on</p>
                                                <p>{new Date(selectedTicket.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
                                            >
                                                {saving ? "Saving..." : "Save Changes"}
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                disabled={saving}
                                                className="inline-flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-700 px-5 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={startEdit}
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-800"
                                            >
                                                <PencilLine className="w-4 h-4" />
                                                Edit Ticket
                                            </button>
                                            <button
                                                onClick={promptDelete}
                                                disabled={deletingId === selectedTicket.id}
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-red-200 text-red-700 px-5 py-3 text-sm font-medium hover:bg-red-50 disabled:opacity-60"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {deletingId === selectedTicket.id ? "Deleting..." : "Delete Ticket"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmTicket && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-[28px] bg-white shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Confirm Delete</p>
                            <h3 className="text-xl font-semibold text-gray-900">Delete this ticket?</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                This will permanently remove <span className="font-medium text-gray-700">{deleteConfirmTicket.title}</span>.
                            </p>
                        </div>

                        <div className="px-6 py-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmTicket(null)}
                                className="inline-flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-700 px-5 py-3 text-sm font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={deletingId === deleteConfirmTicket.id}
                                className="inline-flex items-center justify-center rounded-2xl bg-red-600 text-white px-5 py-3 text-sm font-medium hover:bg-red-700 disabled:opacity-60"
                            >
                                {deletingId === deleteConfirmTicket.id ? "Deleting..." : "Yes, delete it"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}