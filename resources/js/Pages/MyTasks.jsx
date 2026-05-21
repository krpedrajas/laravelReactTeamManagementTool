import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function MyTasks({ mytasks }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Tasks
                </h2>
            }
        >
            <Head title="My Tasks" />

            <div className="p-6">

                {/* Create Task Button */}
                <div className="mb-6 flex justify-start">
                    <Link
                        href={route('tasks.create')}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                    >
                        Create Task
                    </Link>
                </div>

                {/* Task List */}
                {(!mytasks || mytasks.length === 0) ? (
                    <p>You currently have no tasks.</p>
                ) : (
                    <div className="space-y-4">
                        {/*Task Card*/}
                        {mytasks.map((task) => (
                            <div
                                key={task.id}
                                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                            >
                                {/* Task Title and Status */}
                                <div className="flex items-center justify-between gap-4">
                                    {/* Task Title */}
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {task.title}
                                    </h3>
                                    {/* Task Status Badge */}
                                    <span
                                        className={`rounded-full px-2 py-1 text-md font-semibold ${
                                            task.is_completed
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {task.is_completed ? 'Completed' : 'Open'}
                                    </span>
                                </div>
                                {/* Task Description */}
                                {task.description && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        {task.description}
                                    </p>
                                )}
                                {/* Due Date */}
                                {task.due_date && (
                                    <p className="mt-3 text-sm text-gray-500">
                                        Due: {new Date(task.due_date).toLocaleDateString()}
                                    </p>
                                )}
                                {/* Task Action Buttons */}
                                <div className="mt-5 flex justify-between">
                                    {/* Edit and Delete Buttons */}
                                    <span className="flex">
                                        <Link
                                            href={route('tasks.edit', task.id)}
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                                        >
                                            Edit
                                        </Link>                              
                                        <Link
                                            href={route('tasks.delete', task.id)}
                                            className="rounded-md bg-red-600 mx-3 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
                                        >
                                            Delete
                                        </Link>
                                    </span>
                                    {/* Mark as Completed and Undo Button */}
                                    {!task.is_completed ? (
                                        <button
                                        onClick={() =>
                                            router.put(route('tasks.update', task.id), {
                                                is_completed: true,
                                            })
                                        }
                                        disabled={task.is_completed}
                                        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                                    >
                                        Mark as Completed
                                    </button>
                                    ) : null}                                  
                                    {task.is_completed ? (
                                        <button
                                            onClick={() =>
                                                router.put(route('tasks.update', task.id), {
                                                    is_completed: false,
                                                })
                                            }
                                            className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-yellow-700"
                                        >
                                            Undo
                                        </button>
                                    ) : null}
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}