<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Department;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['user', 'location', 'department']);

        // Basic Filtering Logic 
        if ($request->has('department') && $request->department != '') {
            $query->where('department_id', $request->department);
        }

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        $tickets = $query->latest()->get();
        $departments = Department::all();

        return view('admin.index', compact('tickets', 'departments'));
    }

    public function show(Ticket $ticket)
    {
        // Load relationships so we can see the location, user, and assigned staff
        $ticket->load(['user', 'location', 'department', 'assignedStaff', 'history']);

        return view('admin.show', compact('ticket'));
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:needs-attention,in-progress,resolved'],
            'priority' => ['required', 'integer', 'in:1,2,3'],
        ]);

        $oldStatus = $ticket->status;
        $newStatus = $validated['status'];
        $oldPriority = (int) $ticket->priority;
        $newPriority = (int) $validated['priority'];

        $ticket->update([
            'status' => $newStatus,
            'priority' => $newPriority,
        ]);

        if ($oldStatus !== $newStatus) {
            \App\Models\TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id' => 1,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'comment' => 'Status manually updated via Admin Dashboard.'
            ]);
        }

        if ($oldPriority !== $newPriority) {
            \App\Models\TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id' => 1,
                'old_status' => $newStatus,
                'new_status' => $newStatus,
                'comment' => "Priority changed from {$oldPriority} to {$newPriority}."
            ]);
        }

        return back()->with('success', 'Ticket status and priority updated.');
    }
}
