<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::with('members')->get();

        return Inertia::render('Teams', [
            'teams' => $teams,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Team::create($validated);

        return back();
    }

    // JOIN TEAM (current user)
    public function addMember(Team $team)
    {
        $team->members()->syncWithoutDetaching([
            auth()->id()
        ]);

        return back();
    }

    // LEAVE TEAM (current user)
    public function removeMember(Team $team)
    {
        $team->members()->detach(auth()->id());

        return back();
    }

    public function destroy(Team $team)
    {
        $team->delete();

        return back();
    }
}