<div class="p-6 bg-gray-900 text-white min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Campus Safety: Admin Oversight</h1>

    <form action="{{ route('admin.dashboard') }}" method="GET" class="mb-8 flex gap-4">
        <select name="department" class="bg-gray-800 border border-gray-700 p-2 rounded">
            <option value="">All Departments</option>
            @foreach($departments as $dept)
                <option value="{{ $dept->id }}">{{ $dept->name }}</option>
            @endforeach
        </select>

        <button type="submit" class="bg-blue-600 px-4 py-2 rounded">Filter</button>
    </form>

    <table class="w-full text-left border-collapse">
        <<thead>
            <tr class="border-b border-gray-700">
                <th class="p-3">Title</th>
                <th class="p-3">Reporter</th>
                <th class="p-3">Location</th>
                <th class="p-3">Status</th>
                <th class="p-3">Priority</th>
                <th class="p-3 text-right">Action</th>
            </tr>
            </thead>
            <tbody>
                @foreach($tickets as $ticket)
                    <tr class="border-b border-gray-800 hover:bg-gray-800 transition">
                        <td class="p-3">{{ $ticket->title }}</td>
                        <td class="p-3">{{ $ticket->user->name }}</td>
                        <td class="p-3 text-gray-400">
                            {{ $ticket->location->building_prefix }} {{ $ticket->location->room_number }}
                        </td>
                        <td class="p-3">
                            <span
                                class="px-2 py-1 rounded text-xs {{ $ticket->status === 'needs-attention' ? 'bg-red-900 text-red-100' : 'bg-green-900 text-green-100' }}">
                                {{ $ticket->status }}
                            </span>
                        </td>
                        <td class="p-3 font-mono text-yellow-500">{{ $ticket->priority }}</td>

                        <td class="p-3 text-right">
                            <a href="{{ route('admin.tickets.show', $ticket) }}"
                                class="inline-block px-3 py-1 bg-gray-700 hover:bg-blue-600 text-white text-sm rounded transition border border-gray-600">
                                Investigate
                            </a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
    </table>
</div>