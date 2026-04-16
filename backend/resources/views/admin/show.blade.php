<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investigate: {{ $ticket->title }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-[#f3f8ff] text-slate-900 font-sans antialiased">
    <div
        class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.40)_0%,_rgba(219,234,254,0.00)_38%),radial-gradient(circle_at_top_right,_rgba(147,197,253,0.24)_0%,_rgba(147,197,253,0.00)_30%),linear-gradient(180deg,#ffffff_0%,#f3f8ff_100%)]">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div class="mb-6">
                <a href="{{ route('admin.dashboard') }}"
                    class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-white transition">
                    &larr; Back to Dashboard
                </a>
            </div>

            <div
                class="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-100 text-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.10)] mb-6">
                <div
                    class="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.10)_40%,rgba(255,255,255,0.18)_100%)]">
                </div>
                <div
                    class="relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div class="max-w-2xl">
                        <p
                            class="inline-flex items-center rounded-full border border-white/40 bg-white/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-800 mb-4 backdrop-blur-sm">
                            Investigation View
                        </p>
                        <h2
                            class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
                            {{ $ticket->title }}
                        </h2>
                        <p class="mt-4 text-sm sm:text-base text-slate-800 leading-7">
                            Reported {{ $ticket->created_at->format('M j, Y g:i A') }} ·
                            {{ $ticket->department->name ?? 'Unassigned' }}
                        </p>
                    </div>

                    <div>
                        @if($ticket->priority >= 3)
                            <span
                                class="inline-flex items-center rounded-full border border-rose-300/40 bg-rose-100 px-4 py-2 text-xs font-bold tracking-[0.22em] text-rose-700">HIGH
                                PRIORITY</span>
                        @elseif($ticket->priority == 2)
                            <span
                                class="inline-flex items-center rounded-full border border-sky-300/40 bg-sky-100 px-4 py-2 text-xs font-bold tracking-[0.22em] text-sky-700">MEDIUM
                                PRIORITY</span>
                        @else
                            <span
                                class="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold tracking-[0.22em] text-slate-700">LOW
                                PRIORITY</span>
                        @endif
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-[1.45fr_0.75fr] gap-6">

                <div class="space-y-6">

                    <div
                        class="rounded-[32px] border border-slate-200/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] p-6 lg:p-8">
                        <div class="grid gap-4 sm:grid-cols-3 mb-6">
                            <div class="rounded-3xl bg-[#f0f7ff] border border-sky-100 p-4">
                                <p class="text-[11px] uppercase tracking-[0.22em] text-sky-700">Status</p>
                                <p class="mt-2 text-lg font-semibold text-slate-950 capitalize">
                                    {{ str_replace('-', ' ', $ticket->status) }}
                                </p>
                            </div>
                            <div class="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Routed To</p>
                                <p class="mt-2 text-lg font-semibold text-slate-950">
                                    {{ $ticket->department->name ?? 'Unassigned' }}
                                </p>
                            </div>
                            <div class="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Location</p>
                                <p class="mt-2 text-lg font-semibold text-slate-950">
                                    {{ $ticket->location->building_prefix ?? 'Not specified' }}
                                </p>
                            </div>
                        </div>

                        <div class="rounded-[28px] bg-slate-50 border border-slate-200 p-5 mb-6">
                            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-[0.22em] mb-2">Hazard
                                Description</h3>
                            <p class="text-slate-700 leading-relaxed whitespace-pre-line">{{ $ticket->content }}</p>
                        </div>

                        <div class="flex flex-wrap items-center gap-3 text-sm">
                            <span
                                class="inline-flex items-center rounded-full bg-sky-100 text-slate-950 px-3 py-1.5 font-medium border border-sky-200">
                                AI routed to {{ $ticket->department->name ?? 'Unassigned' }}
                            </span>
                            <span
                                class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700">
                                Created {{ $ticket->created_at->format('M j, Y') }}
                            </span>
                        </div>
                    </div>

                    <div
                        class="rounded-[32px] border border-slate-200/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] p-6 lg:p-8">
                        <h3 class="text-lg font-bold text-slate-950 mb-6">Investigation Timeline</h3>

                        @if($ticket->history && $ticket->history->count() > 0)
                            <div class="space-y-4">
                                @foreach($ticket->history as $log)
                                    <div class="flex items-start gap-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
                                        <div class="mt-1.5">
                                            <div class="w-2.5 h-2.5 rounded-full bg-sky-400"></div>
                                        </div>
                                        <div>
                                            @if($log->comment && $log->old_status === $log->new_status)
                                                <p class="text-sm text-slate-900">{{ $log->comment }}</p>
                                            @else
                                                <p class="text-sm text-slate-900">
                                                    Status changed from <span
                                                        class="font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">{{ $log->old_status }}</span>
                                                    to <span
                                                        class="font-mono text-slate-950 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">{{ $log->new_status }}</span>
                                                </p>
                                            @endif
                                            <p class="text-xs text-slate-500 mt-1">
                                                {{ $log->created_at->format('M j, Y g:i A') }}
                                            </p>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <div
                                class="text-center p-8 bg-slate-50 rounded-[28px] border border-dashed border-slate-200 text-slate-500 text-sm">
                                No admin actions have been recorded yet.
                            </div>
                        @endif
                    </div>
                </div>

                <div class="space-y-6">
                    <div
                        class="rounded-[32px] border border-slate-200/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] p-6">
                        <p class="text-xs font-bold text-slate-500 uppercase tracking-[0.22em] mb-4">Admin Action</p>

                        <div class="mb-6 rounded-3xl bg-[#f0f7ff] border border-sky-100 p-4">
                            <span
                                class="block text-[11px] font-bold text-sky-700 uppercase tracking-[0.22em] mb-1">Current
                                Status</span>
                            <span
                                class="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 capitalize">
                                {{ str_replace('-', ' ', $ticket->status) }}
                            </span>
                        </div>

                        <form action="{{ route('admin.tickets.update', $ticket) }}" method="POST" class="space-y-4">
                            @csrf
                            @method('PATCH')

                            <div>
                                <label
                                    class="block text-xs font-bold text-slate-500 uppercase tracking-[0.22em] mb-2">Update
                                    Status To</label>
                                <select name="status"
                                    class="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition">
                                    <option value="needs-attention" {{ $ticket->status == 'needs-attention' ? 'selected' : '' }}>Needs Attention</option>
                                    <option value="in-progress" {{ $ticket->status == 'in-progress' ? 'selected' : '' }}>
                                        In Progress</option>
                                    <option value="resolved" {{ $ticket->status == 'resolved' ? 'selected' : '' }}>
                                        Resolved</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    class="block text-xs font-bold text-slate-500 uppercase tracking-[0.22em] mb-2">Update
                                    Priority</label>
                                <select name="priority"
                                    class="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition">
                                    <option value="1" {{ $ticket->priority == 1 ? 'selected' : '' }}>Priority 1 (Low)
                                    </option>
                                    <option value="2" {{ $ticket->priority == 2 ? 'selected' : '' }}>Priority 2 (Medium)
                                    </option>
                                    <option value="3" {{ $ticket->priority == 3 ? 'selected' : '' }}>Priority 3 (High)
                                    </option>
                                </select>
                            </div>

                            <button type="submit"
                                class="w-full flex items-center justify-center rounded-2xl bg-sky-100 text-slate-950 px-5 py-3 text-sm font-bold hover:bg-sky-50 transition shadow-lg shadow-sky-200/30">
                                Save Changes
                            </button>
                        </form>

                        <button type="button" id="open-delete-modal"
                            class="mt-3 w-full flex items-center justify-center rounded-2xl bg-white border border-rose-200 text-rose-700 px-5 py-3 text-sm font-bold hover:bg-rose-50 transition shadow-sm">
                            Delete Ticket
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div id="delete-modal"
        class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="w-full max-w-md rounded-[28px] bg-white shadow-2xl border border-slate-100 overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-[0.24em] mb-2">Confirm Delete</p>
                <h3 class="text-xl font-semibold text-slate-950">Delete this ticket?</h3>
                <p class="mt-2 text-sm text-slate-500">
                    This will permanently remove <span class="font-medium text-slate-800">{{ $ticket->title }}</span>.
                    This action cannot be undone.
                </p>
            </div>

            <div class="px-6 py-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button type="button" id="cancel-delete-modal"
                    class="inline-flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-700 px-5 py-3 text-sm font-semibold hover:bg-slate-50 transition">
                    Cancel
                </button>

                <form action="{{ route('admin.tickets.destroy', $ticket) }}" method="POST">
                    @csrf
                    @method('DELETE')
                    <button type="submit"
                        class="inline-flex items-center justify-center rounded-2xl bg-rose-100 text-rose-700 px-5 py-3 text-sm font-semibold hover:bg-rose-50 transition shadow-sm">
                        Yes, delete it
                    </button>
                </form>
            </div>
        </div>
    </div>

    <script>
        const deleteModal = document.getElementById('delete-modal');
        const openDeleteModal = document.getElementById('open-delete-modal');
        const cancelDeleteModal = document.getElementById('cancel-delete-modal');

        function showDeleteModal() {
            deleteModal.classList.remove('hidden');
            deleteModal.classList.add('flex');
        }

        function hideDeleteModal() {
            deleteModal.classList.add('hidden');
            deleteModal.classList.remove('flex');
        }

        openDeleteModal?.addEventListener('click', showDeleteModal);
        cancelDeleteModal?.addEventListener('click', hideDeleteModal);
        deleteModal?.addEventListener('click', function (event) {
            if (event.target === deleteModal) {
                hideDeleteModal();
            }
        });
    </script>
</body>

</html>