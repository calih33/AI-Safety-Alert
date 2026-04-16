<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investigate: {{ $ticket->title }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-[#f7f7fb] text-gray-900 font-sans antialiased">
    <div class="min-h-screen py-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            <div class="mb-6">
                <a href="{{ route('admin.dashboard') }}"
                    class="text-sm font-medium text-gray-500 hover:text-gray-900 transition flex items-center gap-2">
                    &larr; Back to Dashboard
                </a>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div class="lg:col-span-2 space-y-6">

                    <div class="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 lg:p-8">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $ticket->title }}</h2>
                                <p class="text-sm text-gray-500">
                                    Reported {{ $ticket->created_at->format('M j, Y g:i A') }}
                                </p>
                            </div>
                            @if($ticket->priority >= 3)
                                <span
                                    class="px-3 py-1.5 rounded-lg border bg-red-100 text-red-800 border-red-200 text-xs font-bold tracking-wide">PRIORITY
                                    3</span>
                            @elseif($ticket->priority == 2)
                                <span
                                    class="px-3 py-1.5 rounded-lg border bg-yellow-100 text-yellow-800 border-yellow-200 text-xs font-bold tracking-wide">PRIORITY
                                    2</span>
                            @else
                                <span
                                    class="px-3 py-1.5 rounded-lg border bg-gray-100 text-gray-700 border-gray-300 text-xs font-bold tracking-wide">PRIORITY
                                    1</span>
                            @endif
                        </div>

                        <div class="bg-[#f6f7fb] p-5 rounded-2xl mb-6">
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hazard Description
                            </h3>
                            <p class="text-gray-700 leading-relaxed">{{ $ticket->content }}</p>
                        </div>

                        <div class="flex items-center gap-6 text-sm">
                            <div>
                                <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">AI
                                    Routed To</span>
                                <span
                                    class="font-medium text-gray-900">{{ $ticket->department->name ?? 'Unassigned' }}</span>
                            </div>
                            <div>
                                <span
                                    class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</span>
                                <span
                                    class="font-medium text-gray-900">{{ $ticket->location ?? 'Not specified' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 lg:p-8">
                        <h3 class="text-lg font-bold text-gray-900 mb-6">Investigation Timeline</h3>

                        @if($ticket->history && $ticket->history->count() > 0)
                            <div class="space-y-4">
                                @foreach($ticket->history as $log)
                                    <div class="flex items-start gap-4">
                                        <div class="mt-1.5">
                                            <div class="w-2 h-2 rounded-full bg-gray-300"></div>
                                        </div>
                                        <div>
                                            @if($log->comment && $log->old_status === $log->new_status)
                                                <p class="text-sm text-gray-900">{{ $log->comment }}</p>
                                            @else
                                                <p class="text-sm text-gray-900">
                                                    Status changed from <span
                                                        class="font-mono text-gray-500 bg-gray-100 px-1 py-0.5 rounded">{{ $log->old_status }}</span>
                                                    to <span
                                                        class="font-mono text-gray-900 bg-[#f6f7fb] px-1 py-0.5 rounded border border-gray-200">{{ $log->new_status }}</span>
                                                </p>
                                            @endif
                                            <p class="text-xs text-gray-400 mt-1">{{ $log->created_at->format('M j, Y g:i A') }}
                                            </p>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <div class="text-center p-6 bg-[#f6f7fb] rounded-2xl text-gray-500 text-sm">
                                No admin actions have been recorded yet.
                            </div>
                        @endif
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6">
                        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Admin Action</h3>

                        <div class="mb-6">
                            <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current
                                Status</span>
                            <span
                                class="inline-block px-3 py-1 rounded-lg border bg-[#f6f7fb] text-gray-900 font-medium capitalize border-gray-200 text-sm">
                                {{ str_replace('-', ' ', $ticket->status) }}
                            </span>
                        </div>

                        <form action="{{ route('admin.tickets.update', $ticket) }}" method="POST" class="space-y-4">
                            @csrf
                            @method('PATCH')

                            <div>
                                <label
                                    class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Update
                                    Status To</label>
                                <select name="status"
                                    class="w-full bg-[#f6f7fb] border-transparent text-gray-900 text-sm rounded-xl px-4 py-3 focus:border-gray-300 focus:ring-0 outline-none transition">
                                    <option value="needs-attention" {{ $ticket->status == 'needs-attention' ? 'selected' : '' }}>Needs Attention</option>
                                    <option value="in-progress" {{ $ticket->status == 'in-progress' ? 'selected' : '' }}>
                                        In Progress</option>
                                    <option value="resolved" {{ $ticket->status == 'resolved' ? 'selected' : '' }}>
                                        Resolved</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Update
                                    Priority</label>
                                <select name="priority"
                                    class="w-full bg-[#f6f7fb] border-transparent text-gray-900 text-sm rounded-xl px-4 py-3 outline-none">
                                    <option value="1" {{ $ticket->priority == 1 ? 'selected' : '' }}>Priority 1 (Low)
                                    </option>
                                    <option value="2" {{ $ticket->priority == 2 ? 'selected' : '' }}>Priority 2 (Medium)
                                    </option>
                                    <option value="3" {{ $ticket->priority == 3 ? 'selected' : '' }}>Priority 3 (High)
                                    </option>
                                </select>
                            </div>

                            <button type="submit"
                                class="w-full flex items-center justify-center rounded-xl bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-800 transition">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    </div>
</body>

</html>