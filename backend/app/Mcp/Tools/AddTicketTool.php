<?php

namespace App\Mcp\Tools;

use App\Http\Controllers\AIController;
use App\Models\Ticket;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description("Add a ticket item to the database. It takes user_id, location_id, department_id, title, content, status (needs-attention | in-progress | resolved), and priority (low, medium, high) as parameters.")]
class AddTicketTool extends Tool {
    public function handle(Request $request): Response {
        $validated = $request->validate( 
            [
                'user_id' => 'required|integer',
                'location_id' => 'required|integer',
                'department_id' => 'required|integer',
                'title' => 'required|string',
                'content' => 'required|string',
                'status' => 'required|string|in:needs-attention,in-progress,resolved',
                'priority' => 'required|string|in:low,medium,high'
            ]);

        // Map priority string to integer
        $priorityMap = [
            'low' => 1,
            'medium' => 2,
            'high' => 3,
        ];
        $validated['priority'] = $priorityMap[$validated['priority']];
        $content = $validated['content'];
        $validated['ai_summary'] = AIController::generateSummary($content);

        $ticket = Ticket::create($validated);

        logger("Ticket created: " . $ticket->id);

        return Response::text('Ticket created successfully with ID: ' . $ticket->id);
    }

    public function schema(JsonSchema $schema): array {
        return [
            'user_id' => $schema->integer()
                ->description("The ID of the user creating the ticket")
                ->required(),
            'location_id' => $schema->integer()
                ->description("The ID of the location where the ticket is reported")
                ->required(),
            'department_id' => $schema->integer()
                ->description("The ID of the department responsible for the ticket")
                ->required(),
            'title' => $schema->string()
                ->description("The title of the ticket")
                ->required(),
            'content' => $schema->string()
                ->description("The detailed content or description of the ticket")
                ->required(),
            'status' => $schema->string()
                ->description("The status of the ticket")
                ->enum(['needs-attention','in-progress','resolved'])
                ->required(),
            'priority' => $schema->string()
                ->description("The priority level of the ticket")
                ->enum(['low', 'medium', 'high'])
                ->required(),
        ];
    }
}
