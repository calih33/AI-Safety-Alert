<div class="p-8 bg-gray-900 text-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto">
        <a href="{{ route('admin.dashboard') }}" class="text-blue-400 hover:underline">← Go Back</a>

        <div class="mt-6 flex justify-between items-start">
            <div>
                <h1 class="text-3xl font-bold">{{ $ticket->title }}</h1>
                <p class="text-gray-400">Reported by {{ $ticket->user->name }} at
                    {{ $ticket->location->building_prefix }} {{ $ticket->location->room_number }}
                </p>
            </div>
            <div class="text-right">
                <span class="px-3 py-1 bg-red-900 rounded-full text-sm font-bold">Priority:
                    {{ $ticket->priority }}</span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 class="text-xl font-semibold mb-4 text-yellow-500">Raw Report</h2>
                <p class="leading-relaxed text-gray-300 italic">"{{ $ticket->content }}"</p>
            </div>

            <div class="bg-blue-900/20 p-6 rounded-lg border border-blue-800">
                <h2 class="text-xl font-semibold mb-4 text-blue-400">AI Intelligence</h2>

                <h3 class="font-bold text-sm uppercase tracking-wider text-gray-400">Summary</h3>
                <p class="mb-4 text-gray-200">
                    {{ $ticket->ai_summary['summary'] ?? 'The AI is currently sleeping on the job.' }}
                </p>

                <h3 class="font-bold text-sm uppercase tracking-wider text-gray-400">Recommended Actions</h3>
                <ul class="list-disc ml-5 text-gray-200">
                    @foreach($ticket->ai_summary['actions'] ?? ['No immediate actions suggested.'] as $action)
                        <li>{{ $action }}</li>
                    @endforeach
                </ul>
            </div>
        </div>

        <div class="mt-12 border-t border-gray-800 pt-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-400">Admin Actions</h2>

            <div class="flex gap-4">
                <form action="{{ route('admin.tickets.updateStatus', $ticket) }}" method="POST">
                    @csrf
                    @method('PATCH')
                    <input type="hidden" name="status" value="in-progress">
                    <button type="submit" class="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded font-bold transition">
                        START Investigation
                    </button>
                </form>

                <form action="{{ route('admin.tickets.updateStatus', $ticket) }}" method="POST">
                    @csrf
                    @method('PATCH')
                    <input type="hidden" name="status" value="resolved">
                    <button type="submit"
                        class="bg-green-700 hover:bg-green-600 px-6 py-2 rounded font-bold transition">
                        RESOLVED Hazard
                    </button>
                </form>
            </div>
        </div>

        <div class="mt-10">
            <h3 class="text-sm font-bold uppercase text-gray-500 mb-4">Audit Log</h3>
            <div class="space-y-2">
                @forelse($ticket->history as $log)
                    <div class="text-sm text-gray-400 bg-gray-800/50 p-3 rounded">
                        <span class="text-blue-400">{{ $log->created_at->diffForHumans() }}:</span>
                        Changed from <span class="text-red-400">{{ $log->old_status }}</span>
                        to <span class="text-green-400">{{ $log->new_status }}</span>
                    </div>
                @empty
                    <p class="text-sm text-gray-600">No status changes recorded yet.</p>
                @endforelse
            </div>
        </div>
    </div>
</div>