<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Todo;
use Inertia\Inertia;

class TodoController extends Controller
{
    //returns all todos for the currently logged in authenticated user
    public function index()
    {
        return Inertia::render('Todos/Index', [
            'mytasks' => auth()->user()->todos()->latest()->get(),
        ]);
    }

    //create page for a new todo
    public function create()
    {
        return Inertia::render('Todos/Create');
    }

    //creates a new todo for the currently logged in authenticated user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        auth()->user()->todos()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'is_completed' => false,
        ]);

        return redirect()->route('mytasks')
            ->with('success', 'Task created successfully!');
    }
    //update an existing todo
    public function update(Request $request, Todo $todo)
    {
        //abort if todo does not belong to the logged in user
        abort_if($todo->user_id !== auth()->id(), 403);
        //validate the input
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'is_completed' => 'sometimes|boolean',
            'due_date' => 'sometimes|nullable|date',
        ]);
        $todo->update($validated);
        //return the updated todo
        return redirect()->route('mytasks');
    }
    //delete an existing todo
    public function destroy(Todo $todo)
    {
        //abort if todo does not belong to the logged in user
        abort_if($todo->user_id !== auth()->id(), 403);
        //delete the todo
        $todo->delete();
        //return success response
        return redirect()->route('mytasks');
    }
}
