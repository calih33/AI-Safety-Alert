<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;

Route::get('/login', function () {
    return redirect('http://localhost:5173/login');
})->name('login');

Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
Route::get('/admin/tickets/{ticket}', [DashboardController::class, 'show'])->name('admin.tickets.show');
Route::patch('/admin/tickets/{ticket}', [DashboardController::class, 'updateStatus'])->name('admin.tickets.update');
Route::delete('/admin/tickets/{ticket}', [DashboardController::class, 'destroy'])->name('admin.tickets.destroy');

Route::get('/', function () {
    return response()->json(['Laravel' => app()->version()]);
});
