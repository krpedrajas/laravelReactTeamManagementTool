import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Delete({ task }) {
    const { delete: destroy, processing } = useForm();

    const deleteTask = (e) => {
        e.preventDefault();

        destroy(route('tasks.destroy', task.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Delete Task
                </h2>
            }
        >
            <Head title="Delete Task" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">

                        <form onSubmit={deleteTask} className="space-y-4">
                            <div>
                                <p className="mb-6 block text-sm font-medium">
                                    Are you sure you want to delete this task?
                                </p>

                                <p className="mb-6 block text-lg font-bold">
                                    {task.title}
                                </p>

                                <p className="block text-sm font-medium text-red-600">
                                    This action cannot be undone.
                                </p>
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
                                    className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    Delete Task
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}