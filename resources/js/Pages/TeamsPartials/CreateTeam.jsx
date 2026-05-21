import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CreateTeam() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/teams');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Team
                </h2>
            }
        >
            <Head title="Create Team" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">

                        <form onSubmit={submit} className="space-y-4">

                            {/* Team Name */}
                            <div>
                                <label className="block text-sm font-medium">Team Name</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded border-gray-300"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <Link
                                    href="/teams"
                                    className="rounded px-4 py-2 text-sm text-gray-600 hover:underline"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Save Team
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}