import React, { useEffect, useState, useRef } from 'react';

export default function MessageModal({
    isOpen,
    user,
    onClose,
    currentUserId,
}) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);

    const isSelf = user && user.id === currentUserId;

    // scroll refs
    const containerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const shouldAutoScrollRef = useRef(true);

    // -----------------------------
    // FORMAT DATE + TIME
    // -----------------------------
    const formatDateTime = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // -----------------------------
    // CHECK IF USER IS AT BOTTOM
    // -----------------------------
    const isAtBottom = () => {
        const el = containerRef.current;
        if (!el) return true;

        return el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    };

    // -----------------------------
    // TRACK USER SCROLL
    // -----------------------------
    const handleScroll = () => {
        shouldAutoScrollRef.current = isAtBottom();
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    // -----------------------------
    // SMART SCROLL
    // -----------------------------
    const scrollToBottom = (force = false) => {
        if (force || shouldAutoScrollRef.current) {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

    // -----------------------------
    // FETCH MESSAGES
    // -----------------------------
    const fetchMessages = async () => {
        if (isSelf) return;

        try {
            const response = await fetch(`/messages/${user.id}`, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                const err = await response.json().catch(() => null);
                setError(err?.message || 'Failed to load messages.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setMessages(data);

            setTimeout(() => scrollToBottom(false), 50);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
        }
    };

    // -----------------------------
    // OPEN CHAT
    // -----------------------------
    useEffect(() => {
        if (!isOpen || !user) return;

        setError(null);

        if (isSelf) {
            setMessages([]);
            setLoading(false);
            return;
        }

        fetchMessages();

        shouldAutoScrollRef.current = true;

        const interval = setInterval(fetchMessages, 2000);
        return () => clearInterval(interval);
    }, [isOpen, user]);

    // -----------------------------
    // SEND MESSAGE
    // -----------------------------
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || isSelf) return;

        try {
            setSending(true);
            setError(null);

            const csrfMeta = document.querySelector(
                'meta[name="csrf-token"]',
            );

            if (!csrfMeta) {
                setError('CSRF token missing in page.');
                setSending(false);
                return;
            }

            const response = await fetch('/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfMeta.getAttribute('content'),
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    recipient_id: user.id,
                    content: newMessage,
                }),
            });

            const data = await response.json().catch(() => null);

            if (response.status === 419) {
                setError('Session expired. Reloading...');
                setTimeout(() => window.location.reload(), 800);
                return;
            }

            if (response.ok) {
                setNewMessage('');

                await fetchMessages();

                shouldAutoScrollRef.current = true;
                scrollToBottom(true);
            } else {
                const msg =
                    data?.message ||
                    (data?.errors &&
                        Object.values(data.errors).flat()[0]) ||
                    'Failed to send message.';
                setError(msg);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Network error sending message.');
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-96 flex flex-col">

                {/* HEADER */}
                <div className="border-b p-4 flex justify-between">
                    <h3 className="font-semibold">
                        Chat with {user.name}
                    </h3>
                    <button onClick={onClose}>×</button>
                </div>

                {/* MESSAGES */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto p-4 bg-gray-50"
                >
                    {loading ? (
                        <p className="text-center text-gray-500">
                            Loading...
                        </p>
                    ) : messages.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No messages yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.sender_id === currentUserId
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                                            message.sender_id === currentUserId
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-300 text-gray-900'
                                        }`}
                                    >
                                        <p className="text-sm">
                                            {message.content}
                                        </p>

                                        {/* DATE + TIME */}
                                        <p className="text-xs mt-1 opacity-70">
                                            {formatDateTime(
                                                message.created_at,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* scroll anchor */}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* INPUT */}
                <form
                    onSubmit={handleSendMessage}
                    className="border-t p-4 flex gap-2"
                >
                    <input
                        value={newMessage}
                        onChange={(e) =>
                            setNewMessage(e.target.value)
                        }
                        className="flex-1 border px-3 py-2 rounded"
                        placeholder="Type a message..."
                        disabled={sending}
                    />

                    <button
                        disabled={sending}
                        className="bg-blue-500 text-white px-4 rounded"
                    >
                        {sending ? '...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}