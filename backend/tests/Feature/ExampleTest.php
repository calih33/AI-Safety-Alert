<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Location;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;


    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_user_cannot_update_or_delete_another_users_ticket(): void
    {
        $owner = $this->makeUser('owner1@example.com', 'CAMPUS-0001');
        $attacker = $this->makeUser('attacker1@example.com', 'CAMPUS-0002');
        $ticket = $this->makeTicketFor($owner);

        Sanctum::actingAs($attacker);

        $updateResponse = $this->patchJson("/api/tickets/{$ticket->id}", [
            'title' => 'Hacked title',
        ]);

        $deleteResponse = $this->deleteJson("/api/tickets/{$ticket->id}");

        $updateResponse->assertStatus(403);
        $deleteResponse->assertStatus(403);
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'title' => $ticket->title,
        ]);
    }

    public function test_update_rejects_invalid_status(): void
    {
        $owner = $this->makeUser('owner3@example.com', 'CAMPUS-0003');
        $ticket = $this->makeTicketFor($owner);

        Sanctum::actingAs($owner);

        $response = $this->patchJson("/api/tickets/{$ticket->id}", [
            'status' => 'done',
        ]);

        $response->assertStatus(422);
    }

    private function makeUser(string $email, string $campusId): User
    {
        return User::query()->create([
            'campus_id' => $campusId,
            'name' => 'Test User',
            'email' => $email,
            'password' => Hash::make('password'),
            'type' => 'user',
        ]);
    }

    private function makeTicketFor(User $user): Ticket
    {
        $location = Location::query()->create([
            'building_prefix' => 'SW1',
            'room_number' => '100',
        ]);

        $department = Department::query()->create([
            'name' => 'Maintenance ' . uniqid('', true),
            'email' => 'maintenance@example.com',
            'phone' => '555-0000',
            'location_id' => $location->id,
        ]);

        return Ticket::query()->create([
            'user_id' => $user->id,
            'location_id' => $location->id,
            'department_id' => $department->id,
            'title' => 'Broken light',
            'content' => 'The hallway light is flickering.',
            'status' => 'needs-attention',
            'priority' => 1,
            'ai_summary' => [
                'summary' => 'Needs maintenance attention.',
                'actions' => ['Inspect fixture'],
            ],
        ]);
    }
}
