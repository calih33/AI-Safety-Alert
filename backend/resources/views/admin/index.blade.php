<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campus Hazards - Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-[#f3f8ff] text-slate-900 font-sans antialiased">
    <div
        class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.40)_0%,_rgba(219,234,254,0.00)_38%),radial-gradient(circle_at_top_right,_rgba(147,197,253,0.24)_0%,_rgba(147,197,253,0.00)_30%),linear-gradient(180deg,#ffffff_0%,#f3f8ff_100%)]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div
                class="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-100 text-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.10)] mb-6 lg:mb-8">
                <div
                    class="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.10)_40%,rgba(255,255,255,0.18)_100%)]">
                </div>
                <div class="relative p-6 sm:p-8 lg:p-10">
                    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div class="max-w-2xl">
                            <p
                                class="inline-flex items-center rounded-full border border-white/40 bg-white/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-800 mb-4 backdrop-blur-sm">
                                Admin Portal
                            </p>
                            <h2
                                class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
                                Campus Hazards</h2>
                            <p class="mt-4 max-w-xl text-sm sm:text-base text-slate-800 leading-7">
                                Review reports, prioritize responses, and keep the campus running with a high-contrast,
                                campaign-style workflow.
                            </p>
                        </div>

                        <div class="flex flex-wrap items-center gap-3">
                            <form action="{{ route('admin.dashboard') }}" method="GET" class="flex flex-wrap gap-2">
                                <select name="department"
                                    class="min-w-[180px] bg-white/90 border border-white/50 text-slate-800 text-sm rounded-2xl px-4 py-3 outline-none shadow-sm backdrop-blur-sm">
                                    <option value="">All Departments</option>
                                    @foreach($departments as $dept)
                                        <option value="{{ $dept->id }}" {{ request('department') == $dept->id ? 'selected' : '' }}>
                                            {{ $dept->name }}
                                        </option>
                                    @endforeach
                                </select>
                                <button type="submit"
                                    class="inline-flex items-center justify-center rounded-2xl bg-sky-100 text-slate-950 px-5 py-3 text-sm font-semibold hover:bg-sky-50 transition shadow-lg shadow-sky-200/30">
                                    Filter
                                </button>
                            </form>

                            <a href="{{ rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') }}/dashboard"
                                class="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-white/45 px-5 py-3 text-sm font-medium text-slate-900 hover:bg-white/60 transition backdrop-blur-sm">
                                &larr; Back to Student View
                            </a>
                        </div>
                    </div>

                    <div class="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div class="rounded-3xl bg-white/50 border border-white/60 p-4 backdrop-blur-sm">
                            <p class="text-[11px] uppercase tracking-[0.24em] text-slate-600">Reports</p>
                            <p class="mt-2 text-2xl font-bold text-slate-950">{{ $tickets->count() }}</p>
                        </div>
                        <div class="rounded-3xl bg-white/50 border border-white/60 p-4 backdrop-blur-sm">
                            <p class="text-[11px] uppercase tracking-[0.24em] text-slate-600">Attention</p>
                            <p class="mt-2 text-2xl font-bold text-slate-950">
                                {{ $tickets->where('status', 'needs-attention')->count() }}
                            </p>
                        </div>
                        <div class="rounded-3xl bg-white/50 border border-white/60 p-4 backdrop-blur-sm">
                            <p class="text-[11px] uppercase tracking-[0.24em] text-slate-600">In Progress</p>
                            <p class="mt-2 text-2xl font-bold text-slate-950">
                                {{ $tickets->where('status', 'in-progress')->count() }}
                            </p>
                        </div>
                        <div class="rounded-3xl bg-white/50 border border-white/60 p-4 backdrop-blur-sm">
                            <p class="text-[11px] uppercase tracking-[0.24em] text-slate-600">Resolved</p>
                            <p class="mt-2 text-2xl font-bold text-slate-950">
                                {{ $tickets->where('status', 'resolved')->count() }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="rounded-[36px] border border-slate-200/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-slate-100 bg-slate-50/70">
                                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.22em]">
                                    Report</th>
                                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.22em]">
                                    Priority</th>
                                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.22em]">
                                    Department</th>
                                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.22em]">
                                    Status</th>
                                <th
                                    class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.22em] text-right">
                                    Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            @forelse($tickets as $ticket)
                                <tr class="hover:bg-[#f0f7ff] transition-colors">
                                    <td class="px-6 py-5">
                                        <div class="font-semibold text-slate-950 text-lg">{{ $ticket->title }}</div>
                                        <div class="text-xs text-slate-500 mt-1">Reported
                                            {{ $ticket->created_at->diffForHumans() }}
                                        </div>
                                    </td>

                                    <td class="px-6 py-5">
                                        @if($ticket->priority >= 3)
                                            <span
                                                class="inline-flex items-center px-3 py-1.5 rounded-full border bg-rose-100 text-rose-700 border-rose-200 text-[10px] font-bold tracking-[0.22em]">HIGH</span>
                                        @elseif($ticket->priority == 2)
                                            <span
                                                class="inline-flex items-center px-3 py-1.5 rounded-full border bg-sky-100 text-sky-700 border-sky-200 text-[10px] font-bold tracking-[0.22em]">MEDIUM</span>
                                        @else
                                            <span
                                                class="inline-flex items-center px-3 py-1.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200 text-[10px] font-bold tracking-[0.22em]">LOW</span>
                                        @endif
                                    </td>

                                    <td class="px-6 py-5 text-xs font-semibold text-slate-600 uppercase tracking-[0.16em]">
                                        {{ $ticket->department->name ?? 'Assessing...' }}
                                    </td>

                                    <td class="px-6 py-5">
                                        <span
                                            class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 capitalize">
                                            {{ str_replace('-', ' ', $ticket->status) }}
                                        </span>
                                    </td>

                                    <td class="px-6 py-5 text-right">
                                        <a href="{{ route('admin.tickets.show', $ticket) }}"
                                            class="inline-flex items-center justify-center rounded-2xl bg-sky-100 text-slate-950 px-5 py-2.5 text-xs font-semibold hover:bg-sky-50 transition shadow-lg shadow-sky-200/30">
                                            Investigate
                                        </a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="px-6 py-14 text-center">
                                        <div
                                            class="mx-auto max-w-md rounded-[28px] border border-dashed border-sky-200 bg-[#f3f8ff] px-6 py-8">
                                            <p class="text-lg font-semibold text-slate-900 mb-2">No campus hazards reported
                                                yet.</p>
                                            <p class="text-sm text-slate-500">Once students submit issues, they will appear
                                                here for admin review.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</body>

</html>