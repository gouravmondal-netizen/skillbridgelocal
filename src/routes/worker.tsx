import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bell, Wallet as WalletIcon, Star, BadgeCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStore, store } from "@/lib/use-store";
import {
  employers,
  haversine,
  matchScore,
  ME,
  TIER_STYLE,
  tierFor,
  transactions,
  uid,
} from "@/lib/skillbridge";

export const Route = createFileRoute("/worker")({
  head: () => ({
    meta: [
      { title: "Worker Dashboard — SkillBridge" },
      {
        name: "description",
        content: "Track nearby job matches, applications, wallet earnings, ratings and skill badges in one place.",
      },
      { property: "og:title", content: "Worker Dashboard — SkillBridge" },
      { property: "og:description", content: "Applications, wallet, ratings and skill badges for local workers." },
    ],
  }),
  component: WorkerDash,
});

function WorkerDash() {
  const { jobs, applications, location, radius } = useStore();
  const mine = applications.filter((a) => a.workerId === ME.id);
  const nearby = jobs
    .map((j) => ({ j, km: haversine(location, j), score: matchScore(ME, j) }))
    .filter(({ km, j }) => km <= radius && !mine.some((a) => a.jobId === j.id))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const earned = transactions.filter((t) => t.status === "Paid").reduce((s, t) => s + t.amount, 0);
  const pending = transactions.filter((t) => t.status === "Pending").reduce((s, t) => s + t.amount, 0);
  const tier = tierFor(ME.experience, ME.rating, ME.verified);

  function accept(jobId: string, score: number) {
    store.set((s) => ({
      applications: [
        ...s.applications,
        { id: uid(), jobId, workerId: ME.id, status: "Applied", date: new Date().toISOString().slice(0, 10), score },
      ],
    }));
    toast.success("Applied from notification");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
            {ME.photo}
          </span>
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              Hello, {ME.name.split(" ")[0]} {ME.verified && <BadgeCheck className="size-6 text-primary" />}
            </h1>
            <p className="text-sm text-muted-foreground">
              {ME.qualification} · {ME.experience} yrs experience · {ME.area}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={`border-0 ${TIER_STYLE[tier]}`}>{tier} skill badge</Badge>
          <Button asChild variant="outline" size="sm">
            <Link to="/jobs">Browse all jobs</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Nearby matches", v: nearby.length },
          { l: "Applications", v: mine.length },
          { l: "Total earned", v: `₹${earned.toLocaleString("en-IN")}` },
          { l: "Rating", v: `${ME.rating} ★` },
        ].map((s) => (
          <div key={s.l} className="panel p-5">
            <p className="text-sm text-muted-foreground">{s.l}</p>
            <p className="mt-1 font-display text-2xl font-bold">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="panel p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <Bell className="size-5 text-accent" /> Notifications — new jobs nearby
            </h2>
            <div className="mt-4 space-y-3">
              {nearby.length === 0 && <p className="text-sm text-muted-foreground">No new matches right now.</p>}
              {nearby.map(({ j, km, score }) => {
                const emp = employers.find((e) => e.id === j.employerId);
                return (
                  <div key={j.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {j.title} <span className="text-sm font-normal text-muted-foreground">· {emp?.company}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹{j.salary.toLocaleString("en-IN")}/{j.payPeriod} · {km.toFixed(1)} km · match {score}%
                      </p>
                    </div>
                    <Button size="sm" onClick={() => accept(j.id, score)}>Accept</Button>
                    <Button size="sm" variant="ghost" onClick={() => toast("Declined — we'll show fewer like this")}>
                      Decline
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel p-6">
            <h2 className="font-display text-lg font-bold">My applications</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="pb-2">Job</th>
                    <th className="pb-2">Employer</th>
                    <th className="pb-2">Applied</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mine.map((a) => {
                    const j = jobs.find((x) => x.id === a.jobId);
                    const emp = employers.find((e) => e.id === j?.employerId);
                    return (
                      <tr key={a.id} className="border-t border-border">
                        <td className="py-3 font-medium">{j?.title ?? "—"}</td>
                        <td className="py-3 text-muted-foreground">{emp?.company ?? "—"}</td>
                        <td className="py-3 text-muted-foreground">{a.date}</td>
                        <td className="py-3">
                          <Badge variant={a.status === "Hired" ? "default" : "secondary"}>{a.status}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel p-6">
            <h2 className="font-display text-lg font-bold">Ratings & feedback</h2>
            <div className="mt-4 space-y-3 text-sm">
              {[
                { by: "GreenBuild Constructions", stars: 5, text: "Excellent wiring work, finished ahead of schedule." },
                { by: "Sunrise Cafe", stars: 4, text: "Punctual and polite. Would hire again for weekends." },
              ].map((r) => (
                <div key={r.by} className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.by}</span>
                    <span className="flex">
                      {Array.from({ length: r.stars }).map((_, i) => (
                        <Star key={i} className="size-4 fill-accent text-accent" />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="panel p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <WalletIcon className="size-5 text-primary" /> Wallet
            </h2>
            <p className="mt-3 font-display text-3xl font-bold text-primary">₹{earned.toLocaleString("en-IN")}</p>
            <p className="text-sm text-muted-foreground">₹{pending.toLocaleString("en-IN")} pending clearance</p>
            <Button className="mt-4 w-full" onClick={() => toast.success("Withdrawal requested to linked bank account")}>
              Withdraw money
            </Button>
            <div className="mt-4 space-y-2 text-sm">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between border-t border-border pt-2">
                  <div>
                    <p className="font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{t.amount.toLocaleString("en-IN")}</p>
                    <p className={`text-xs ${t.status === "Paid" ? "text-success" : "text-muted-foreground"}`}>{t.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-6">
            <h2 className="font-display text-lg font-bold">Certificates & badges</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Verified certificates raise your badge tier and your match score.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              {[
                { n: "ITI Electrician (Govt.)", p: 100 },
                { n: "Electrical Safety Level 2", p: 100 },
                { n: "Solar Wiring (in progress)", p: 45 },
              ].map((c) => (
                <div key={c.n}>
                  <div className="flex justify-between">
                    <span>{c.n}</span>
                    <span className="text-muted-foreground">{c.p}%</span>
                  </div>
                  <Progress value={c.p} className="mt-1 h-2" />
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/training">Add a new skill</Link>
            </Button>
          </section>

          <section className="panel p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold">
              <MapPin className="size-4 text-primary" /> Profile & settings
            </h2>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              <li>Location: {location.label}</li>
              <li>Search radius: {radius} km</li>
              <li>Preferred: {ME.preferredType} · {ME.availability}</li>
              <li>Expected: ₹{ME.expectedSalary.toLocaleString("en-IN")}</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
