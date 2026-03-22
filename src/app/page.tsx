"use client";

import { useCallback, useMemo, useState } from "react";

type Todo = {
    id: string;
    title: string;
    done: boolean;
    createdAt: number;
};

type Filter = "all" | "active" | "done";

function createId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [draft, setDraft] = useState("");
    const [filter, setFilter] = useState<Filter>("all");

    const filtered = useMemo(() => {
        if (filter === "active") return todos.filter((t) => !t.done);
        if (filter === "done") return todos.filter((t) => t.done);
        return todos;
    }, [todos, filter]);

    const stats = useMemo(() => {
        const total = todos.length;
        const done = todos.filter((t) => t.done).length;
        return { total, done, active: total - done };
    }, [todos]);

    const addTodo = useCallback(() => {
        const title = draft.trim();
        if (!title) return;
        setTodos((prev) => [
            {
                id: createId(),
                title,
                done: false,
                createdAt: Date.now(),
            },
            ...prev,
        ]);
        setDraft("");
    }, [draft]);

    const toggleTodo = useCallback((id: string) => {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        );
    }, []);

    const removeTodo = useCallback((id: string) => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const clearCompleted = useCallback(() => {
        setTodos((prev) => prev.filter((t) => !t.done));
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            <div
                className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-30"
                aria-hidden
                style={{
                    backgroundImage:
                        "radial-gradient(ellipse 80% 50% at 50% -20%, rgb(45 212 191 / 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgb(59 130 246 / 0.12), transparent), radial-gradient(ellipse 50% 35% at 0% 80%, rgb(20 184 166 / 0.15), transparent)",
                }}
            />
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(24_24_27/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(24_24_27/0.06)_1px,transparent_1px)] bg-size-[64px_64px] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)]"
                aria-hidden
            />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-12 pt-12 sm:px-6 sm:pt-16">
                <header className="mb-8 text-center sm:mb-10">
                    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-zinc-600 shadow-sm backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-400">
                        <span
                            className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16_185_129/0.8)]"
                            aria-hidden
                        />
                        Local · API ready to wire
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        <span className="bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-cyan-400">
                            Tasks
                        </span>
                    </h1>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        Capture what matters. Hook up your endpoint when you are
                        ready—state lives here for now.
                    </p>
                </header>

                <main className="flex flex-1 flex-col">
                    <div className="rounded-2xl border border-zinc-200/90 bg-white/85 p-1 shadow-xl shadow-zinc-900/5 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85 dark:shadow-black/40">
                        <form
                            className="flex gap-2 p-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                addTodo();
                            }}
                        >
                            <label htmlFor="new-todo" className="sr-only">
                                New task
                            </label>
                            <input
                                id="new-todo"
                                type="text"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="What needs doing?"
                                className="min-w-0 flex-1 rounded-xl border border-transparent bg-zinc-50/90 px-4 py-3 text-[15px] text-zinc-900 placeholder:text-zinc-400 outline-none ring-0 transition focus:border-teal-500/40 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-950"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="shrink-0 rounded-xl bg-linear-to-br from-teal-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition hover:brightness-110 active:scale-[0.98] dark:from-teal-500 dark:to-cyan-500 dark:shadow-teal-950/30"
                            >
                                Add
                            </button>
                        </form>

                        <div
                            className="mx-2 mb-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200/80 px-1 pt-3 dark:border-zinc-800/80"
                            role="tablist"
                            aria-label="Filter tasks"
                        >
                            {(
                                [
                                    ["all", "All"],
                                    ["active", "Active"],
                                    ["done", "Done"],
                                ] as const
                            ).map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    role="tab"
                                    aria-selected={filter === key}
                                    onClick={() => setFilter(key)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                        filter === key
                                            ? "bg-teal-500/15 text-teal-800 dark:bg-teal-400/15 dark:text-teal-200"
                                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                            <span className="ml-auto text-xs tabular-nums text-zinc-500 dark:text-zinc-500">
                                {stats.done}/{stats.total} done
                            </span>
                        </div>

                        <ul
                            className="max-h-[min(60vh,28rem)] space-y-1 overflow-y-auto px-2 pb-2"
                            aria-label="Task list"
                        >
                            {filtered.length === 0 ? (
                                <li className="rounded-xl px-4 py-12 text-center">
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        {todos.length === 0
                                            ? "Nothing here yet"
                                            : filter === "active"
                                              ? "No active tasks"
                                              : filter === "done"
                                                ? "No completed tasks"
                                                : "No tasks"}
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                                        {todos.length === 0
                                            ? "Add a task above to get started."
                                            : "Try another filter or add something new."}
                                    </p>
                                </li>
                            ) : (
                                filtered.map((todo) => (
                                    <li
                                        key={todo.id}
                                        className="group flex items-stretch gap-2 rounded-xl border border-transparent bg-zinc-50/50 transition hover:border-zinc-200/80 hover:bg-white/90 dark:bg-zinc-950/40 dark:hover:border-zinc-700/80 dark:hover:bg-zinc-900/90"
                                    >
                                        <div className="flex min-w-0 flex-1 items-start gap-3 py-3 pl-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleTodo(todo.id)
                                                }
                                                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                                                    todo.done
                                                        ? "border-teal-500 bg-teal-500 text-white dark:border-teal-400 dark:bg-teal-500"
                                                        : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900"
                                                }`}
                                                aria-pressed={todo.done}
                                                aria-label={
                                                    todo.done
                                                        ? `Mark "${todo.title}" as not done`
                                                        : `Mark "${todo.title}" as done`
                                                }
                                            >
                                                {todo.done ? (
                                                    <svg
                                                        className="size-3"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={3}
                                                        aria-hidden
                                                    >
                                                        <title>Completed</title>
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m4.5 12.75 6 6 9-13.5"
                                                        />
                                                    </svg>
                                                ) : null}
                                            </button>
                                            <span
                                                className={`min-w-0 flex-1 pt-0.5 text-[15px] leading-snug ${
                                                    todo.done
                                                        ? "text-zinc-400 line-through dark:text-zinc-500"
                                                        : "text-zinc-800 dark:text-zinc-200"
                                                }`}
                                            >
                                                {todo.title}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeTodo(todo.id)}
                                            className="shrink-0 rounded-r-xl px-3 text-zinc-400 opacity-0 transition hover:bg-red-500/10 hover:text-red-600 group-hover:opacity-100 dark:hover:text-red-400"
                                            aria-label={`Remove ${todo.title}`}
                                        >
                                            <svg
                                                className="size-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                                aria-hidden
                                            >
                                                <title>Remove</title>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18 18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {stats.done > 0 ? (
                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                onClick={clearCompleted}
                                className="text-xs font-medium text-zinc-500 underline-offset-4 transition hover:text-teal-700 hover:underline dark:hover:text-teal-400"
                            >
                                Clear completed ({stats.done})
                            </button>
                        </div>
                    ) : null}
                </main>

                <footer className="mt-10 text-center">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        Jenkins Next demo · swap in your API when ready
                    </p>
                </footer>
            </div>
        </div>
    );
}
