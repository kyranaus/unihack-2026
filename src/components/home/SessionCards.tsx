// src/components/home/SessionCards.tsx
import { Card, CardContent } from "#/components/ui/card"
import { Badge } from "#/components/ui/badge"

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
    <section className="flex-1 overflow-y-auto pb-4">
      <div className="space-y-3">
        {DUMMY_SESSIONS.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">{session.title}</h2>
                <Badge variant="outline">{session.tag}</Badge>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{session.subtitle}</p>
              <p className="mt-2 text-[11px] text-muted-foreground/60">
                Coming soon: AI summaries, crash reports, and learner logs.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
