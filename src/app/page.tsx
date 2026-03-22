export default function Home() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            {/* Ambient background */}
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

            <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
                <header className="mb-16 flex flex-col gap-6 sm:mb-20 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-zinc-600 shadow-sm backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-400">
                            <span
                                className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16_185_129/0.8)]"
                                aria-hidden
                            />
                            CI/CD pipeline
                        </p>
                        <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.1]">
                            Hello from{" "}
                            <span className="bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-cyan-400">
                                Next.js
                            </span>
                        </h1>
                        <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                            This app is connected to Jenkins: a webhook triggers
                            your pipeline on every push so builds stay in sync
                            with your branch.
                        </p>
                    </div>
                    <div className="shrink-0 rounded-2xl border border-zinc-200/90 bg-white/80 p-5 shadow-lg shadow-zinc-900/5 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-black/40">
                        <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
                            Webhook
                        </p>
                        <p className="mt-2 font-mono text-sm text-teal-700 dark:text-teal-300">
                            POST → Jenkins job
                        </p>
                        <div className="mt-4 flex gap-2">
                            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                Build
                            </span>
                            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                Test
                            </span>
                            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                Deploy
                            </span>
                        </div>
                    </div>
                </header>

                <section className="grid flex-1 gap-4 sm:grid-cols-3">
                    <article className="group rounded-2xl border border-zinc-200/90 bg-white/90 p-6 shadow-sm transition hover:border-teal-300/60 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-teal-700/50">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400">
                            <svg
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                aria-hidden
                            >
                                <title>Source control</title>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                                />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Push &amp; notify
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                            Git events reach Jenkins so automation starts
                            without manual clicks.
                        </p>
                    </article>
                    <article className="group rounded-2xl border border-zinc-200/90 bg-white/90 p-6 shadow-sm transition hover:border-teal-300/60 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-teal-700/50">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">
                            <svg
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                aria-hidden
                            >
                                <title>Pipeline</title>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 13.5 10.5 6.75l4.5 4.5 6-6M3.75 6.75h16.5M3.75 10.5h16.5"
                                />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Repeatable stages
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                            The same steps run every time—fewer surprises when
                            you ship.
                        </p>
                    </article>
                    <article className="group rounded-2xl border border-zinc-200/90 bg-white/90 p-6 shadow-sm transition hover:border-teal-300/60 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-teal-700/50">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                            <svg
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                aria-hidden
                            >
                                <title>Next.js</title>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Modern app shell
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                            Next.js gives you routing, rendering, and assets in
                            one cohesive stack.
                        </p>
                    </article>
                </section>

                <footer className="mt-auto pt-20">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200/80 pt-8 dark:border-zinc-800/80">
                        <p className="text-sm text-zinc-500 dark:text-zinc-500">
                            Jenkins Next demo · DevOps playground
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Next.js 16", "Jenkins", "Webhook"].map(
                                (label) => (
                                    <span
                                        key={label}
                                        className="rounded-lg border border-zinc-200/90 bg-white/60 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400"
                                    >
                                        {label}
                                    </span>
                                ),
                            )}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
