import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/use-store";
import { employers, workers } from "@/lib/skillbridge";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin & Impact Analytics — SkillBridge" },
      { name: "description", content: "Platform-wide metrics: workers, employers, jobs posted, jobs filled and SDG 8 impact." },
      { property: "og:title", content: "Admin & Impact Analytics — SkillBridge" },
      { property: "og:description", content: "Approvals, reports and SDG 8 employment impact analytics." },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { jobs, applications, tickets } = useStore();
  const filled = jobs.filter((j) => j.status === "Filled").length;
  const hires = applications.filter((a) => a.status === "Hired").length;
  const byType = ["Daily Wage", "Weekend", "Part Time", "Contract"].map((t) => ({
    t,
    n: jobs.filter((j) => j.type === t).length,
  }));
  const max = Math.max(1, ...byType.map((b) => b.n));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Platform health, approvals and SDG 8 impact reporting.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { l: "Total workers", v: workers.length },
          { l: "Total employers", v: employers.length },
          { l: "Jobs posted", v: jobs.length },
          { l: "Jobs filled", v: filled + hires },
          { l: "Open tickets", v: tickets.filter((t) => t.status === "Open").length },
        ].map((s) => (
          <div key={s.l} className="panel p-5">
            <p className="text-sm text-muted-foreground">{s.l}</p>
            <p className="mt-1 font-display text-2xl font-bold">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="panel p-6">
          <h2 className="font-display text-lg font-bold">Jobs by type</h2>
          <div className="mt-4 space-y-3">
            {byType.map((b) => (
              <div key={b.t}>
                <div className="flex justify-between text-sm">
                  <span>{b.t}</span>
                  <span className="text-muted-foreground">{b.n}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${(b.n / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="font-display text-lg font-bold">Pending approvals</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[...workers.filter((w) => !w.verified), ...employers.filter((e) => !e.verified)].map((x) => (
              <div key={"company" in x ? x.id + "e" : x.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <span>{"company" in x ? `${x.company} — license check` : `${x.name} — certificate verification`}</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel mt-6 p-6">
        <h2 className="font-display text-lg font-bold">SDG 8 impact report</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { l: "Avg. hiring time", v: "1.4 days", d: "vs 11 days industry average" },
            { l: "Avg. commute", v: "3.2 km", d: "travel cost reduced ~68%" },
            { l: "Weekend earners", v: `${jobs.filter((j) => j.type === "Weekend").reduce((s, j) => s + j.vacancies, 0)}`, d: "second-income opportunities live" },
          ].map((k) => (
            <div key={k.l} className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">{k.l}</p>
              <p className="mt-1 font-display text-2xl font-bold text-primary">{k.v}</p>
              <p className="text-xs text-muted-foreground">{k.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
