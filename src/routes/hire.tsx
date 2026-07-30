import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GpsPanel } from "@/components/gps-panel";
import { store, useStore } from "@/lib/use-store";
import {
  haversine,
  matchScore,
  MY_EMPLOYER,
  tierFor,
  TIER_STYLE,
  uid,
  workers,
  type Job,
  type JobType,
} from "@/lib/skillbridge";

export const Route = createFileRoute("/hire")({
  head: () => ({
    meta: [
      { title: "Hire Local Workers — SkillBridge" },
      {
        name: "description",
        content: "Post a job and instantly see ranked workers within 8 km, with skill badges and match scores.",
      },
      { property: "og:title", content: "Hire Local Workers — SkillBridge" },
      { property: "og:description", content: "One-click hiring from a GPS-ranked pool of nearby local talent." },
    ],
  }),
  component: Hire,
});

const TYPES: JobType[] = ["Daily Wage", "Weekend", "Part Time", "Contract"];

function Hire() {
  const { jobs, radius } = useStore();
  const [form, setForm] = useState({
    title: "Weekend Store Helper",
    description: "Assist customers and restock shelves on Saturday and Sunday.",
    salary: 900,
    payPeriod: "day" as "day" | "month",
    duration: "Ongoing",
    type: "Weekend" as JobType,
    skills: "Retail Sales, Communication",
    qualification: "10th Pass",
    experience: 0,
    vacancies: 3,
    urgent: false,
  });
  const [draftId, setDraftId] = useState<string | null>(null);

  const draftJob: Job = useMemo(
    () => ({
      id: draftId ?? "draft",
      employerId: MY_EMPLOYER.id,
      title: form.title,
      description: form.description,
      salary: Number(form.salary),
      payPeriod: form.payPeriod,
      duration: form.duration,
      type: form.type,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      qualification: form.qualification,
      experience: Number(form.experience),
      area: MY_EMPLOYER.area,
      lat: MY_EMPLOYER.lat,
      lng: MY_EMPLOYER.lng,
      vacancies: Number(form.vacancies),
      urgent: form.urgent,
      status: "Open",
      postedAt: new Date().toISOString().slice(0, 10),
    }),
    [form, draftId],
  );

  const ranked = workers
    .map((w) => ({ w, score: matchScore(w, draftJob), km: haversine(w, draftJob) }))
    .filter((r) => r.km <= radius)
    .sort((a, b) => b.score - a.score);

  function publish() {
    const job = { ...draftJob, id: uid() };
    store.set((s) => ({ jobs: [job, ...s.jobs] }));
    setDraftId(job.id);
    toast.success("Job published", {
      description: `${ranked.length} matching workers within ${radius} km were notified.`,
    });
  }

  function invite(name: string) {
    toast.success(`Invitation sent to ${name}`, { description: "They'll get a push notification instantly." });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Hire Workers</h1>
          <p className="mt-1 text-muted-foreground">
            Posting as <strong>{MY_EMPLOYER.company}</strong> · {MY_EMPLOYER.area} · {jobs.length} live jobs on platform
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/employer">Go to Employer Dashboard</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="panel p-6">
          <h2 className="font-display text-lg font-bold">Job posting form</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="title">Job title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="sal">Salary (₹)</Label>
              <Input id="sal" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Pay period</Label>
              <div className="mt-2 flex gap-2">
                {(["day", "month"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setForm({ ...form, payPeriod: p })}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      form.payPeriod === p ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    per {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Job type</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      form.type === t ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="dur">Duration</Label>
              <Input id="dur" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="vac">Vacancies</Label>
              <Input id="vac" type="number" value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: Number(e.target.value) })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="sk">Required skills (comma separated)</Label>
              <Input id="sk" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="q">Qualification</Label>
              <Input id="q" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ex">Min. experience (years)</Label>
              <Input id="ex" type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })} />
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={form.urgent}
                onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
                className="size-4 accent-[oklch(0.44_0.09_178)]"
              />
              Emergency hiring — notify all matched workers immediately
            </label>
          </div>
          <Button className="mt-6" onClick={publish}>
            Publish Job
          </Button>
        </section>

        <aside className="space-y-6">
          <GpsPanel
            subject="workers"
            pins={workers.map((w) => ({ id: w.id, lat: w.lat, lng: w.lng, label: w.name, kind: "worker" as const }))}
          />
        </aside>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">AI matching engine — live preview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Score = 40% skills + 30% distance + 20% experience + 10% ratings. Updates as you edit the form.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ranked.map(({ w, score, km }) => {
            const tier = tierFor(w.experience, w.rating, w.verified);
            return (
              <div key={w.id} className="panel p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary font-display font-bold text-secondary-foreground">
                    {w.photo}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate font-display font-bold">{w.name}</h3>
                      {w.verified && <BadgeCheck className="size-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {w.qualification} · {w.experience} yrs · {w.availability}
                    </p>
                  </div>
                  <span className="ml-auto font-display text-lg font-bold text-primary">{score}%</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <Badge className={`border-0 ${TIER_STYLE[tier]}`}>{tier} badge</Badge>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="size-3.5" /> {km.toFixed(1)} km
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Star className="size-3.5 fill-accent text-accent" /> {w.rating}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{w.skills.join(" · ")}</p>
                <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => invite(w.name)}>
                  Invite & one-click hire
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
