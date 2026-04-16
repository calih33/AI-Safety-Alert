<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campus Hazards - Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-[#f7f7fb] text-gray-900 font-sans antialiased">
    <div class="min-h-screen py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div class="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Admin Portal</p>
                    <h2 class="text-3xl font-bold text-gray-900">Campus Hazards</h2>
                </div>

                <div class="flex items-center gap-4">
                    <form action="{{ route('admin.dashboard') }}" method="GET" class="flex gap-2">
                        <select name="department"
                            class="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 outline-none">
                            <option value="">All Departments</option>
                            @foreach($departments as $dept)
                                <option value="{{ $dept->id }}" {{ request('department') == $dept->id ? 'selected' : '' }}>
                                    {{ $dept->name }}</option>
                            @endforeach
                        </select>
                        <button type="submit"
                            class="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Filter</button>
                    </form>

                    <a href="http://localhost:5173/dashboard"
                        class="text-sm font-medium text-gray-500 hover:text-gray-900 transition flex items-center gap-2 ml-4">
                        &larr; Back to Student View
                    </a>
                </div>
            </div>

            <div class="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden p-2">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-gray-100">
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Report
                                </th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Priority
                                </th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Department</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status
                                </th>
                                <th
                                    class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                                    Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            @foreach($tickets as $ticket)
                                <tr class="hover:bg-[#f6f7fb] transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900 text-lg">{{ $ticket->title }}</div>
                                        <div class="text-xs text-gray-500 mt-1">Reported
                                            {{ $ticket->created_at->diffForHumans() }}</div>
                                    </td>

                                    <td class="px-6 py-4">
                                        @if($ticket->priority >= 3)
                                            <span
                                                class="inline-flex items-center px-2 py-1 rounded border bg-red-100 text-red-800 border-red-200 text-[10px] font-bold tracking-wide">PRIORITY
                                                3</span>
                                        @elseif($ticket->priority == 2)
                                            <span
                                                class="inline-flex items-center px-2 py-1 rounded border bg-yellow-100 text-yellow-800 border-yellow-200 text-[10px] font-bold tracking-wide">PRIORITY
                                                2</span>
                                        @else
                                            <span
                                                class="inline-flex items-center px-2 py-1 rounded border bg-gray-100 text-gray-700 border-gray-300 text-[10px] font-bold tracking-wide">PRIORITY
                                                1</span>
                                        @endif
                                    </td>

                                    <td class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                                        {{ $ticket->department->name ?? 'Assessing...' }}
                                    </td>

                                    <td class="px-6 py-4">
                                        <span class="text-sm font-medium text-gray-900 capitalize">
                                            {{ str_replace('-', ' ', $ticket->status) }}
                                        </span>
                                    </td>

                                    <td class="px-6 py-4 text-right">
                                        <a href="{{ route('admin.tickets.show', $ticket) }}"
                                            class="inline-flex items-center justify-center rounded-xl bg-black text-white px-5 py-2.5 text-xs font-medium hover:bg-gray-800 transition">
                                            Investigate
                                        </a>
                                    </td>
                                </tr>
                            @endforeach

                            @if($tickets->isEmpty())
                                <tr>
                                    <td colspan="5" class="px-6 py-10 text-center text-gray-500">No campus hazards reported
                                        yet.</td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</body>

</html>