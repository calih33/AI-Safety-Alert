<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Department;
use App\Models\User;
use App\Models\Staff;
use App\Models\Ticket;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CampusSeeder extends Seeder
{
    public function run(): void
    {
        // Create Locations
        $sw1 = Location::create(['building_prefix' => 'SW1', 'room_number' => '100']);
        $ne1 = Location::create(['building_prefix' => 'NE1', 'room_number' => '200']);

        // Create Departments linked to those Locations
        $security = Department::create([
            'name' => 'Security',
            'email' => 'security@bcit.ca',
            'location_id' => $sw1->id
        ]);

        $medical = Department::create([
            'name' => 'Medical',
            'email' => 'medical@bcit.ca',
            'location_id' => $ne1->id
        ]);

        // Create a Test Admin User
        User::create([
            'campus_id' => 'A00000001',
            'name' => 'Admin Cali',
            'email' => 'admin@bcit.ca',
            'password' => Hash::make('password123'),
            'type' => 'admin',
        ]);

        // Create a Test Staff Member
        $staffUser = User::create([
            'campus_id' => 'A00000002',
            'name' => 'Officer Smith',
            'email' => 'smith@bcit.ca',
            'password' => Hash::make('password123'),
            'type' => 'staff',
        ]);

        // Link the User to the Staff subtype
        Staff::create([
            'user_id' => $staffUser->id,
            'department_id' => $security->id,
            'location_id' => $sw1->id,
            'phone' => '604-555-0199'
        ]);

        Ticket::create([
            'user_id' => 1,
            'location_id' => 1,
            'department_id' => $security->id,
            'title' => 'Exploding Lab Equipment',
            'content' => 'The coffee machine in the SW1 breakroom is making a very loud noise and shaking violently. It looks like it might explode!',
            'status' => 'needs-attention',
            'priority' => 8,
            'ai_summary' => [
                'summary' => 'Pressure vessel failure in communal kitchen area.',
                'actions' => ['Evacuate room', 'Disable power']
            ]
        ]);
    }
}
