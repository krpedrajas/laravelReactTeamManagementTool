<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\HeartbeatController;
use App\Http\Controllers\TeamController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Welcome
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Teams
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/teams', [TeamController::class, 'index'])->name('teams');
    Route::get('/teams/create', function () {
        return Inertia::render('TeamsPartials/CreateTeam');
    })->name('teams.create');
    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');

    Route::delete('/teams/{team}', [TeamController::class, 'destroy'])
        ->name('teams.destroy');

    // JOIN / LEAVE
    Route::post('/teams/{team}/add-member', [TeamController::class, 'addMember'])
        ->name('teams.addMember');

    Route::delete('/teams/{team}/remove-member', [TeamController::class, 'removeMember'])
        ->name('teams.removeMember');
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Members
|--------------------------------------------------------------------------
*/
Route::get('/members', function () {
    return Inertia::render('Members', [
        'users' => User::all(),
    ]);
})->middleware(['auth', 'verified'])->name('members');

/*
|--------------------------------------------------------------------------
| Tasks
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/mytasks', function () {
        return Inertia::render('MyTasks', [
            'mytasks' => auth()->user()->todos,
        ]);
    })->name('mytasks');

    Route::get('/tasks/create', function () {
        return Inertia::render('Tasks/Create');
    })->name('tasks.create');

    Route::get('/tasks/{todo}/edit', function (\App\Models\Todo $todo) {
        abort_if($todo->user_id !== auth()->id(), 403);
        return Inertia::render('Tasks/EditTask', ['task' => $todo]);
    })->name('tasks.edit');

    Route::get('/tasks/{todo}/delete', function (\App\Models\Todo $todo) {
        abort_if($todo->user_id !== auth()->id(), 403);
        return Inertia::render('Tasks/Delete', ['task' => $todo]);
    })->name('tasks.delete');

    Route::post('/tasks', [TodoController::class, 'store'])->name('tasks.store');

    Route::put('/tasks/{todo}', [TodoController::class, 'update'])
        ->name('tasks.update');

    Route::delete('/tasks/{todo}', [TodoController::class, 'destroy'])
        ->name('tasks.destroy');
});

/*
|--------------------------------------------------------------------------
| Profile + System
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/members/status', function () {
        return response()->json(
            User::select('id', 'last_active_at')->get()
        );
    })->name('members.status');

    Route::get('/heartbeat', HeartbeatController::class)->name('heartbeat');

    Route::get('/messages/{recipientId}', [MessageController::class, 'getConversation'])
        ->name('messages.conversation');

    Route::post('/messages', [MessageController::class, 'send'])
        ->name('messages.send');
});

require __DIR__.'/auth.php';