<?php

namespace App\Mcp\Tools;

use App\Http\Controllers\AIController;
use App\Models\Ticket;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description("Add a ticket item to the database. It takes user_id, location_id, title, and content as parameters.")]
class AddTicketTool extends Tool {
    public function handle(Request $request): Response {
        $validated = $request->validate( 
            [
                'user_id' => 'required|integer',
                'location_id' => 'required|integer',
                'title' => 'required|string',
                'content' => 'required|string',
            ]);

        $content = $validated['content'];
        $validated['priority'] = AIController::generatePriority($content);
        $validated['ai_summary'] = AIController::generateSummary($content);
        $validated['department_id'] = AIController::generateDepartmentID($content);
        $validated['status'] = 'needs-attention';

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
            'title' => $schema->string()
                ->description("The title of the ticket")
                ->required(),
            'content' => $schema->string()
                ->description("The detailed content or description of the ticket")
                ->required(),
        ];
    }
}
