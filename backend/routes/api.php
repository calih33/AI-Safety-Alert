<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;

Route::get('aitest/{content}', function (string $content) {
    return AIController::generateSummary($content);
});