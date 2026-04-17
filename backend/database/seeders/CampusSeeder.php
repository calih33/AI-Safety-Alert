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
        $sw1 = Location::firstOrCreate(['building_prefix' => 'SW1', 'room_number' => '100']);
        $ne1 = Location::firstOrCreate(['building_prefix' => 'NE1', 'room_number' => '200']);

        $security = Department::firstOrCreate(
            ['name' => 'Security'],
            [
                'email' => 'security@bcit.ca',
                'location_id' => $sw1->id, // Fixed: Use the ID from the variable above
                'phone' => '604-555-0199'
            ]
        );

        $medical = Department::firstOrCreate(
            ['name' => 'Medical'],
            [
                'email' => 'medical@bcit.ca',
                'location_id' => $ne1->id
            ]
        );

        $it = Department::firstOrCreate(
            ['name' => 'IT Support'],
            [
                'email' => 'itsupport@bcit.ca',
                'location_id' => $sw1->id,
                'phone' => '604-555-0110',
            ]
        );

        $facilities = Department::firstOrCreate(
            ['name' => 'Facilities'],
            [
                'email' => 'facilities@bcit.ca',
                'location_id' => $ne1->id,
                'phone' => '604-555-0140',
            ]
        );

        $custodial = Department::firstOrCreate(
            ['name' => 'Custodial'],
            [
                'email' => 'custodial@bcit.ca',
                'location_id' => $sw1->id,
                'phone' => '604-555-0160',
            ]
        );

        $adminCali = User::firstOrCreate(
            ['campus_id' => 'A00000001'],
            [
                'name' => 'Admin Cali',
                'email' => 'admin@bcit.ca',
                'password' => Hash::make('password123'),
                'type' => 'admin',
            ]
        );

        $staffUser = User::firstOrCreate(
            ['campus_id' => 'A00000002'],
            [
                'name' => 'Officer Smith',
                'email' => 'smith@bcit.ca',
                'password' => Hash::make('password123'),
                'type' => 'staff',
            ]
        );

        Staff::firstOrCreate(
            ['user_id' => $staffUser->id],
            [
                'department_id' => $security->id,
                'location_id' => $sw1->id,
                'phone' => '604-555-0199'
            ]
        );

        Ticket::updateOrCreate(
            ['title' => 'Exploding Lab Equipment'],
            [
                'user_id' => $adminCali->id,
                'location_id' => $sw1->id,
                'department_id' => $security->id,
                'content' => 'The coffee machine in the SW1 breakroom is making a very loud noise and shaking violently.',
                'status' => 'needs-attention',
                'priority' => 8,
                'ai_summary' => [
                    'summary' => 'Pressure vessel failure in communal kitchen area.',
                    'actions' => ['Evacuate room', 'Disable power']
                ]
            ]
        );
    }
}
