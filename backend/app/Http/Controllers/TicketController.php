<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index(): JsonResponse
    {
        $tickets = Ticket::where('user_id', Auth::id())
            ->with(['location', 'department'])
            ->latest()
            ->get();

        return response()->json($tickets);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'content'     => ['required', 'string'],
            'location_id' => ['required', 'integer', 'exists:locations,id'],
        ]);

        $content = $request->content;

        $priority     = (int) AIController::generatePriority($content);
        $departmentId = (int) AIController::generateDepartmentID($content);
        $summary      = AIController::generateSummary($content);

        $ticket = Ticket::create([
            'user_id'       => Auth::id(),
            'location_id'   => $request->location_id,
            'department_id' => $departmentId,
            'title'         => $request->title,
            'content'       => $content,
            'priority'      => $priority,
            'ai_summary'    => $summary,
        ]);

        return response()->json($ticket->load(['location', 'department']), 201);
    }
}
