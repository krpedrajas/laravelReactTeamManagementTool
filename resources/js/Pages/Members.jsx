import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MessageModal from '@/Components/MessageModal';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Members({ users }) {
    const { auth } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userStatusMap, setUserStatusMap] = useState(
        users.reduce((map, user) => {
            map[user.id] = user.last_active_at;
            return map;
        }, {}),
    );

    const refreshStatuses = async () => {
        try {
            const response = await fetch('/members/status', {
                method: 'GET',
                credentials: 'same-origin',
                headers: { Accept: 'application/json' },
            });
            if (!response.ok) return;
            const data = await response.json();
            setUserStatusMap(data.reduce((map, user) => {
                map[user.id] = user.last_active_at;
                return map;
            }, {}));
        } catch (error) {
            console.error('Failed to refresh member statuses:', error);
        }
    };

    useEffect(() => {
        refreshStatuses();

        const interval = setInterval(() => {
            refreshStatuses();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const timeAgo = (iso) => {
        if (!iso) return 'Never';
        const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
        if (diff < 30) return 'Online';
        if(diff<60) return `${diff} secs ago`;
        if(diff<120) return '1 min ago';
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    const isOnline = (iso) => {
        if (!iso) return false;
        const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
        return diff < 60;
    };

    const getActiveAt = (user) => {
        if (user.id === auth.user.id) {
            return auth.user.last_active_at;
        }

        return userStatusMap[user.id] ?? user.last_active_at;
    };

    const handleMessageClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Members
                </h2>
            }
        >
            <Head title="Members" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {users.length === 0 ? (
                                <p>No members found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Phone
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Last Active
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {user.phone || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {isOnline(getActiveAt(user)) ? (
                                                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                                                                Online
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500">{timeAgo(getActiveAt(user))}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => {
                                                                if (user.id !== auth.user.id) handleMessageClick(user);
                                                            }}
                                                            disabled={user.id === auth.user.id}
                                                            className={`font-medium ${
                                                                user.id === auth.user.id
                                                                    ? 'text-gray-400 cursor-not-allowed'
                                                                    : 'text-blue-600 hover:text-blue-800'
                                                            }`}
                                                        >
                                                            {user.id === auth.user.id ? 'You' : 'Message'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedUser && (
                <MessageModal
                    isOpen={isModalOpen}
                    user={selectedUser}
                    onClose={handleCloseModal}
                    currentUserId={auth.user.id}
                />
            )}
        </AuthenticatedLayout>
    );
}