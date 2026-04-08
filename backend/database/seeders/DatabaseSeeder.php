<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Fix the "Test User" by adding the missing campus_id
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'campus_id' => 'A00000000', // This satisfies the NOT NULL constraint!
        ]);

        // 2. Call your custom CampusSeeder to build the real environment
        $this->call(CampusSeeder::class);
    }
}
