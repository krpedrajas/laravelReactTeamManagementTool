import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Teams({ teams = [] }) {
    const { auth } = usePage().props;
    const userId = auth?.user?.id;

    const isMember = (team) =>
        Boolean(userId && team.members?.some((m) => m.id === userId));

    const handleJoin = (teamId) => {
        router.post(route('teams.addMember', teamId));
    };

    const handleLeave = (teamId) => {
        router.delete(route('teams.removeMember', teamId));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">
                Teams
            </h2>}
        >
            <Head title="Teams" />

            <div className="p-6">

                <div className="mb-6 flex justify-start">
                    <Link
                        href={route('teams.create')}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                    >
                        Create Team
                    </Link>
                </div>

                {teams.length === 0 ? (
                    <p>No teams found.</p>
                ) : (
                    teams.map((team) => (
                        <div key={team.id} className="border p-4 rounded-lg">

                            <div className="flex items-center">
                                <h3 className="text-lg font-bold">
                                    {team.name}
                                </h3>

                                {!isMember(team) ? (
                                    <button
                                        onClick={() => handleJoin(team.id)}
                                        className="ml-auto bg-green-600 text-white px-4 py-2 rounded"
                                    >
                                        Join
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleLeave(team.id)}
                                        className="ml-auto bg-red-600 text-white px-4 py-2 rounded"
                                    >
                                        Leave
                                    </button>
                                )}
                            </div>

                            <div className="mt-3 text-sm text-gray-700">
                                <div className="font-semibold text-gray-900">
                                    Members ({team.members?.length ?? 0})
                                </div>
                                {team.members?.length > 0 ? (
                                    team.members.map((user) => (
                                        <div key={user.id} className="mt-1">
                                            {user.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="mt-1 text-gray-500">No members yet.</div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}