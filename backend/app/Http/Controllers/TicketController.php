<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Location;
use App\Models\Ticket;
use App\Models\TicketHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $tickets = Ticket::with(['department', 'history', 'location'])
            ->where('user_id', $request->user()->id)
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tickets);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'location' => ['required', 'string', 'max:100'],
        ]);

        [$buildingPrefix, $roomNumber] = $this->parseLocation($validated['location']);
        $location = Location::firstOrCreate([
            'building_prefix' => $buildingPrefix,
            'room_number' => $roomNumber,
        ]);

        $priority = 1;
        $summary = $validated['content'];
        $aiDepartmentId = null;

        try {
            $priority = AIController::generatePriority($validated['content']);
        } catch (\Throwable $e) {
            $priority = 1;
        }

        try {
            $summary = AIController::generateSummary($validated['content']);
        } catch (\Throwable $e) {
            $summary = $validated['content'];
        }

        try {
            $aiDepartmentId = AIController::generateDepartmentID($validated['content']);
        } catch (\Throwable $e) {
            $aiDepartmentId = null;
        }

        $keywordDeptId = $this->inferDepartmentIdFromKeywords($validated['content']);

        $department = null;

        if (is_numeric($aiDepartmentId)) {
            $department = Department::find((int) $aiDepartmentId);
        }

        if (!$department && $keywordDeptId) {
            $department = Department::find($keywordDeptId);
        }

        if (!$department) {
            $department = Department::first();
        }

        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'location_id' => $location->id,
            'department_id' => $department->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'status' => 'needs-attention',
            'priority' => is_numeric($priority) ? (int) $priority : 1,
            'ai_summary' => [
                'summary' => $summary,
                'actions' => ['Review required'],
            ],
        ]);

        return response()->json($ticket->load(['location', 'department']), 201);
    }

    public function update(Request $request, Ticket $ticket): JsonResponse
    {
        if ($request->user()->id !== $ticket->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'title'   => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'status'  => ['sometimes', 'in:needs-attention,in-progress,resolved'],
        ]);

        $oldStatus = $ticket->status;
        $ticket->update($request->only(['title', 'content', 'status']));

        if ($request->has('status') && $oldStatus !== $ticket->status) {
            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id' => $request->user()->id,
                'old_status' => $oldStatus,
                'new_status' => $ticket->status,
                'comment' => 'Status updated via user API.',
            ]);
        }

        return response()->json($ticket->load(['location', 'department']));
    }

    public function destroy(Ticket $ticket): JsonResponse
    {
        if (request()->user()->id !== $ticket->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $ticket->delete();
        return response()->json(['message' => 'Ticket deleted.']);
    }

    private function parseLocation(string $location): array
    {
        $parts = preg_split('/\s+/', trim($location), 2) ?: [];
        return count($parts) < 2 ? [strtoupper(trim($location)), 'N/A'] : [strtoupper($parts[0]), trim($parts[1])];
    }

    private function inferDepartmentIdFromKeywords(string $content): ?int
    {
        $text = strtolower($content);

        $departmentRules = [
            'IT Support' => ['computer', 'laptop', 'monitor', 'wifi', 'internet', 'login', 'password', 'software', 'printer'],
            'Custodial' => ['spill', 'spilled', 'leak', 'garbage', 'clean', 'cleanup', 'washroom', 'biohazard'],
            'Facilities' => ['broken', 'door', 'furniture', 'chair', 'desk', 'light', 'lighting', 'plumbing', 'hvac', 'water damage'],
            'Medical' => ['injury', 'injured', 'bleeding', 'fainted', 'ill', 'medical', 'sick'],
            'Security' => ['threat', 'theft', 'stolen', 'violence', 'fight', 'suspicious', 'unsafe'],
        ];

        foreach ($departmentRules as $departmentName => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($text, $keyword)) {
                    return Department::where('name', $departmentName)->value('id');
                }
            }
        }

        return null;
    }
}
