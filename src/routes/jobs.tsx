import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MapPin, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GpsPanel } from "@/components/gps-panel";
import { useStore, store } from "@/lib/use-store";
import {
  employers,
  haversine,
  matchScore,
  ME,
  uid,
  type JobType,
} from "@/lib/skillbridge";

const TYPES: (JobType | "All")[] = ["All", "Daily Wage", "Weekend", "Part Time", "Contract"];

export const Route = createFileRoute("/jobs")({
  validateSearch: (s: Record<string, unknown>) => ({ type: (s.type as string) ?? "All" }),
  head: () => ({
    meta: [
      { title: "Find Jobs Near You — SkillBridge" },
      {
        name: "description",
        content: "Browse GPS-matched daily wage, weekend, part-time and contract jobs within your chosen radius.",
      },
      { property: "og:title", content: "Find Jobs Near You — SkillBridge" },
      { property: "og:description", content: "Hyperlocal job search with distance, salary and skill filters." },
    ],
  }),
  component: Jobs,
});

function Jobs() {
  const search = Route.useSearch();
  const { jobs, applications, location, radius } = useStore();
  const [type, setType] = useState<string>(search.type);
  const [minSalary, setMinSalary] = useState(0);
  const [skill, setSkill] = useState("");

  const list = useMemo(() => {
    return jobs
      .map((j) => ({ job: j, km: haversine(location, j), score: matchScore(ME, j) }))
      .filter(({ job, km }) => {
        if (km > radius) return false;
        if (type !== "All" && job.type !== type) return false;
        const monthly = job.payPeriod === "day" ? job.salary * 26 : job.salary;
        if (minSalary && monthly < minSalary) return false;
        if (skill && !job.skills.join(" ").toLowerCase().includes(skill.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => b.score - a.score);
  }, [jobs, location, radius, type, minSalary, skill]);

  const applied = new Set(applications.filter((a) => a.workerId === ME.id).map((a) => a.jobId));

  function apply(jobId: string, score: number) {
    if (applied.has(jobId)) return;
    store.set((s) => ({
      applications: [
        ...s.applications,
        { id: uid(), jobId, workerId: ME.id, status: "Applied", date: new Date().toISOString().slice(0, 10), score },
      ],
    }));
    toast.success("Application sent", { description: "The employer has been notified instantly." });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Nearby Jobs</h1>
      <p className="mt-1 text-muted-foreground">
        Ranked for {ME.name} using the SkillBridge match score (skills, distance, experience, ratings).
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <GpsPanel
            subject="jobs"
            pins={jobs.map((j) => ({ id: j.id, lat: j.lat, lng: j.lng, label: j.title, kind: "job" as const }))}
          />
          <div className="panel space-y-4 p-5">
            <h3 className="font-display text-base font-bold">Filters</h3>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Job type</p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      type === t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Minimum monthly equivalent (₹)</p>
              <Input
                type="number"
                min={0}
                step={1000}
                value={minSalary || ""}
                placeholder="e.g. 15000"
                onChange={(e) => setMinSalary(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Skill keyword</p>
              <Input value={skill} placeholder="electrician, packing…" onChange={(e) => setSkill(e.target.value)} />
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          {list.length === 0 && (
            <div className="panel p-10 text-center text-muted-foreground">
              No jobs match these filters inside {radius} km. Try widening the radius.
            </div>
          )}
          {list.map(({ job, km, score }) => {
            const emp = employers.find((e) => e.id === job.employerId)!;
            return (
              <article key={job.id} className="panel p-5 transition-shadow hover:shadow-lift">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-bold">{job.title}</h2>
                      <Badge variant="secondary">{job.type}</Badge>
                      {job.urgent && (
                        <Badge className="border-0 bg-accent text-accent-foreground">
                          <Zap className="mr-1 size-3" /> Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {emp.company} · {emp.industry}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-primary">
                      ₹{job.salary.toLocaleString("en-IN")}
                      <span className="text-sm font-medium text-muted-foreground">/{job.payPeriod}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{job.duration}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm">{job.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.skills.map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm">
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4" /> {job.area} · {km.toFixed(1)} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-4" /> {job.vacancies} vacancies
                    </span>
                    <span>Match {score}%</span>
                  </div>
                  <Button size="sm" disabled={applied.has(job.id)} onClick={() => apply(job.id, score)}>
                    {applied.has(job.id) ? "Applied" : "Apply"}
                  </Button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
