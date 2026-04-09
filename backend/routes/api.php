<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;

Route::get('ai/summary/{content}', function (string $content) {
    return AIController::generateSummary($content);
});

Route::get("ai/priority/{content}", function (string $content) {
    return AIController::generatePriority($content);
});