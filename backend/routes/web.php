<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;

Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
Route::get('/admin/tickets/{ticket}', [DashboardController::class, 'show'])->name('admin.tickets.show');
Route::patch('/admin/tickets/{ticket}/status', [DashboardController::class, 'updateStatus'])->name('admin.tickets.updateStatus');
Route::get('/', function () {
    return view('welcome');
});
