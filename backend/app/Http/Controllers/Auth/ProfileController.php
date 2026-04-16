<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $nameParts = preg_split('/\s+/', trim($user->name ?? ''), 2) ?: [];

        return response()->json([
            'user' => [
                'id' => $user->id,
                'campus_id' => $user->campus_id,
                'email' => $user->email,
                'name' => $user->name,
                'first_name' => $nameParts[0] ?? '',
                'last_name' => $nameParts[1] ?? '',
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users', 'email')->ignore($request->user()->id)],
        ]);

        $user = $request->user();
        $user->name = trim($validated['first_name'] . ' ' . $validated['last_name']);
        $user->email = $validated['email'];
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'campus_id' => $user->campus_id,
                'email' => $user->email,
                'name' => $user->name,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
            ],
        ]);
    }
}
