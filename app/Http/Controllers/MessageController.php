<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function getConversation(Request $request, $recipientId)
    {
        $userId = $request->user()->id;

        // update last active for the requesting user
        $request->user()->forceFill(['last_active_at' => now()])->save();

        $messages = Message::where(function ($query) use ($userId, $recipientId) {
            $query->where('sender_id', $userId)->where('recipient_id', $recipientId)
                ->orWhere('sender_id', $recipientId)->where('recipient_id', $userId);
        })->with(['sender', 'recipient'])->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'content' => 'required|string|max:1000',
        ]);

        // Prevent sending messages to yourself
        $senderId = $request->user()->id;
        if ((int) $validated['recipient_id'] === (int) $senderId) {
            return response()->json([
                'message' => 'You cannot message yourself.'
            ], 422);
        }

        // update last active for sender
        $request->user()->forceFill(['last_active_at' => now()])->save();

        $message = Message::create([
            'sender_id' => $senderId,
            'recipient_id' => $validated['recipient_id'],
            'content' => $validated['content'],
        ]);

        return response()->json($message->load(['sender', 'recipient']), 201);
    }
}
