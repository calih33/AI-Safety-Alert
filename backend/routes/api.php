<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\TicketController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(base_path('routes/auth.php'));

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::put('/tickets/{ticket}', [TicketController::class, 'update']);
    Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy']);
});

Route::get("ai/priority/{content}", function (string $content) {
    return AIController::generatePriority($content);
});

Route::get("ai/department/{content}", function (string $content) {
    return AIController::generateDepartmentID($content);
});
