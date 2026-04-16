<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;

// The Bridge: Stops the "Route not defined" 500 crash
Route::get('/login', function () {
    return redirect('http://localhost:5173/login');
})->name('login');

// The Clean Routes: We will handle admin checks inside the controller for the demo
Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
Route::get('/admin/tickets/{ticket}', [DashboardController::class, 'show'])->name('admin.tickets.show');
Route::patch('/admin/tickets/{ticket}', [DashboardController::class, 'updateStatus'])->name('admin.tickets.update');

Route::get('/', function () {
    return response()->json(['Laravel' => app()->version()]);
});
