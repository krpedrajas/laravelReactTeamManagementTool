import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        due_date: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/tasks');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Task
                </h2>
            }
        >
            <Head title="Create Task" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">

                        <form onSubmit={submit} className="space-y-4">

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded border-gray-300"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    className="mt-1 w-full rounded border-gray-300"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium">Due Date</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded border-gray-300"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <Link
                                    href="/mytasks"
                                    className="rounded px-4 py-2 text-sm text-gray-600 hover:underline"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Save Task
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}