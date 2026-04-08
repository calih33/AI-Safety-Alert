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
        $oldStatus = $ticket->status;
        $newStatus = $request->input('status');

        // Update the ticket
        $ticket->update(['status' => $newStatus]);

        // Log the change in the history table
        \App\Models\TicketHistory::create([
            'ticket_id' => $ticket->id,
            'user_id' => 1,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'comment' => 'Status manually updated via Admin Dashboard.'
        ]);

        return back()->with('success', 'Status updated and logged in the audit trail.');
    }
}
