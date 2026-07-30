import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { store, useStore } from "@/lib/use-store";
import { MY_EMPLOYER, tierFor, TIER_STYLE, workers, haversine } from "@/lib/skillbridge";

export const Route = createFileRoute("/employer")({
  head: () => ({
    meta: [
      { title: "Employer Dashboard — SkillBridge" },
      { name: "description", content: "Manage job posts, review applications, hire locally and track hiring analytics." },
      { property: "og:title", content: "Employer Dashboard — SkillBridge" },
      { property: "og:description", content: "Manage jobs, applications and one-click hiring for local roles." },
    ],
  }),
  component: EmployerDash,
});

function EmployerDash() {
  const { jobs, applications } = useStore();
  const myJobs = jobs.filter((j) => j.employerId === MY_EMPLOYER.id);
  const myApps = applications.filter((a) => myJobs.some((j) => j.id === a.jobId));

  function setStatus(id: string, status: "Shortlisted" | "Hired" | "Rejected") {
    store.set((s) => ({ applications: s.applications.map((a) => (a.id === id ? { ...a, status } : a)) }));
    toast.success(`Candidate ${status.toLowerCase()}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{MY_EMPLOYER.company}</h1>
          <p className="text-sm text-muted-foreground">
            {MY_EMPLOYER.industry} · {MY_EMPLOYER.area} · {MY_EMPLOYER.size} employees · {MY_EMPLOYER.rating} ★
          </p>
        </div>
        <Button asChild><Link to="/hire">Post a new job</Link></Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Active jobs", v: myJobs.filter((j) => j.status === "Open").length },
          { l: "Applications", v: myApps.length },
          { l: "Shortlisted", v: myApps.filter((a) => a.status === "Shortlisted").length },
          { l: "Hired", v: myApps.filter((a) => a.status === "Hired").length },
        ].map((s) => (
          <div key={s.l} className="panel p-5">
            <p className="text-sm text-muted-foreground">{s.l}</p>
            <p className="mt-1 font-display text-2xl font-bold">{s.v}</p>
          </div>
        ))}
      </div>

      <section className="panel mt-6 p-6">
        <h2 className="font-display text-lg font-bold">Manage jobs</h2>
        <div className="mt-4 space-y-3">
          {myJobs.map((j) => (
            <div key={j.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{j.title} <Badge variant="secondary" className="ml-1">{j.type}</Badge></p>
                <p className="text-sm text-muted-foreground">
                  ₹{j.salary.toLocaleString("en-IN")}/{j.payPeriod} · {j.vacancies} vacancies · posted {j.postedAt}
                </p>
              </div>
              <Badge variant={j.status === "Open" ? "default" : "secondary"}>{j.status}</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  store.set((s) => ({
                    jobs: s.jobs.map((x) => (x.id === j.id ? { ...x, status: x.status === "Open" ? "Filled" : "Open" } : x)),
                  }))
                }
              >
                Mark {j.status === "Open" ? "filled" : "open"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="panel mt-6 p-6">
        <h2 className="font-display text-lg font-bold">Applications</h2>
        <div className="mt-4 space-y-3">
          {myApps.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
          {myApps.map((a) => {
            const w = workers.find((x) => x.id === a.workerId);
            const j = jobs.find((x) => x.id === a.jobId);
            if (!w || !j) return null;
            const tier = tierFor(w.experience, w.rating, w.verified);
            return (
              <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-4">
                <span className="grid size-10 place-items-center rounded-full bg-secondary font-display font-bold text-secondary-foreground">
                  {w.photo}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{w.name} <span className="font-normal text-muted-foreground">→ {j.title}</span></p>
                  <p className="text-sm text-muted-foreground">
                    {haversine(w, j).toFixed(1)} km · {w.experience} yrs · {w.rating} ★ · match {a.score}%
                  </p>
                </div>
                <Badge className={`border-0 ${TIER_STYLE[tier]}`}>{tier}</Badge>
                <Badge variant="secondary">{a.status}</Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "Shortlisted")}>Shortlist</Button>
                  <Button size="sm" onClick={() => setStatus(a.id, "Hired")}>Hire</Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel mt-6 p-6">
        <h2 className="font-display text-lg font-bold">Payments & ratings</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Pending payouts to workers</p>
            <p className="mt-1 font-display text-2xl font-bold">₹24,600</p>
            <Button size="sm" className="mt-3" onClick={() => toast.success("Payout released to worker wallets")}>
              Release payments
            </Button>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Your employer rating</p>
            <p className="mt-1 flex items-center gap-1 font-display text-2xl font-bold">
              {MY_EMPLOYER.rating} <Star className="size-5 fill-accent text-accent" />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Based on 38 worker reviews · pays on time</p>
          </div>
        </div>
      </section>
    </div>
  );
}
