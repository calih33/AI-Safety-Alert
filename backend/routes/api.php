<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\NotificationController;

// Auth routes (Login/Register)
Route::middleware('api')->group(base_path('routes/auth.php'));

// PROTECTED ROUTES: Only accessible with a Bearer Token
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});

// AI Helper routes (Keep these for testing if you want, or wrap them too)
Route::get("ai/priority/{content}", function (string $content) {
    return AIController::generatePriority($content);
});

Route::get("ai/department/{content}", function (string $content) {
    return AIController::generateDepartmentID($content);
});
