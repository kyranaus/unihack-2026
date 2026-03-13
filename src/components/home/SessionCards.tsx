const DUMMY_SESSIONS = [
  {
    id: "today-city",
    title: "Today's city drive",
    subtitle: "Short trip with mixed traffic and a few rapid brakes.",
    tag: "Session",
  },
  {
    id: "learner-log",
    title: "Learner log preview",
    subtitle: "Time, distance, and road types for your learner report.",
    tag: "Learner",
  },
  {
    id: "incident-notes",
    title: "Insurance & incident notes",
    subtitle: "Flag key moments for later when you talk to your insurer.",
    tag: "Insurance",
  },
  {
    id: "ai-coach",
    title: "AI driver coach",
    subtitle: "Future AI feedback on drowsiness, distraction, and habits.",
    tag: "AI",
  },
]

export function SessionCards() {
  return (
    <section className="mt-6 flex-1 overflow-y-auto pb-4">
      <div className="space-y-3">
        {DUMMY_SESSIONS.map((session) => (
          <article
            key={session.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{session.title}</h2>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-300">
                {session.tag}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">{session.subtitle}</p>
            <p className="mt-2 text-[11px] text-zinc-500">
              Coming soon: AI summaries, crash reports, and learner logs.
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
