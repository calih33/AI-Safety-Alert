<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;

Route::middleware('api')->group(base_path('routes/auth.php'));

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::get("ai/priority/{content}", function (string $content) {
    return AIController::generatePriority($content);
});

Route::get("ai/department/{content}", function (string $content) {
    return AIController::generateDepartmentID($content);
});
