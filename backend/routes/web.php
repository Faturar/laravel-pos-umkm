<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HealthController;

// Health check endpoint (public)
Route::get('/health', [HealthController::class, 'index']);