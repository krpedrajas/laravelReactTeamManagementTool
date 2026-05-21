<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HeartbeatController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = auth()->user();

        if ($user) {
            $user->update([
                'last_active_at' => now(),
            ]);
        }

        return response()->json(['ok' => true]);
    }
}