<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Location;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Fetch the student's personal disaster list.
     */
    public function index(Request $request): JsonResponse
    {
        // Grounded Security: If they aren't logged in, they get nothing.
        // This stops the server from flatlining when it tries to read a null ID.
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized token'], 401);
        }

        $userId = $request->user()->id;

        // Fetch ONLY this user's tickets and physically attach the investigation history.
        $tickets = Ticket::with(['department', 'history'])
            ->where('user_id', $userId)
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tickets);
    }

    /**
     * Shout into the void (Report a new hazard).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'location' => ['required', 'string', 'max:100'],
        ]);

        // Break the location string into building and room
        [$buildingPrefix, $roomNumber] = $this->parseLocation($validated['location']);
        $location = Location::firstOrCreate([
            'building_prefix' => $buildingPrefix,
            'room_number' => $roomNumber,
        ]);

        // Trigger the AI to do the exhausting work of grading and routing
        $generatedPriority = \App\Http\Controllers\AIController::generatePriority($validated['content']);
        $generatedSummary = \App\Http\Controllers\AIController::generateSummary($validated['content']);
        $generatedDeptId = \App\Http\Controllers\AIController::generateDepartmentID($validated['content']);

        // Fallback to Department 1 if the AI gets confused by the prompt
        $department = \App\Models\Department::find($generatedDeptId)
            ?? \App\Models\Department::first()
            ?? (object)['id' => 1];

        $ticket = Ticket::create([
            'user_id' => $request->user()->id, // No more fallback to User 1
            'location_id' => $location->id,
            'department_id' => $department->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'status' => 'needs-attention',
            'priority' => is_numeric($generatedPriority) ? $generatedPriority : 1,
            'ai_summary' => [
                'summary' => $generatedSummary,
                'actions' => ['Review required']
            ]
        ]);

        return response()->json($ticket, 201);
    }

    /**
     * Physically split a string like "SW1 100" into building and room.
     */
    private function parseLocation(string $location): array
    {
        $parts = preg_split('/\s+/', trim($location), 2) ?: [];

        if (count($parts) < 2) {
            return [strtoupper(trim($location)), 'N/A'];
        }

        return [strtoupper($parts[0]), trim($parts[1])];
    }
}
