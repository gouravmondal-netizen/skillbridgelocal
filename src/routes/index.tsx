import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Search, Briefcase, ShieldCheck, GraduationCap, Wallet, Radar, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImg from "@/assets/hero-workers.jpg";
import { useStore } from "@/lib/use-store";
import { employers, haversine, workers } from "@/lib/skillbridge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge — Find Local Jobs Within 4–8 km" },
      {
        name: "description",
        content:
          "Hyperlocal job platform connecting daily wage, weekend and contract workers with nearby employers through GPS matching, skill badges and training.",
      },
      { property: "og:title", content: "SkillBridge — Find Local Jobs Within 4–8 km" },
      {
        property: "og:description",
        content: "Hyperlocal job platform connecting daily wage, weekend and contract workers with nearby employers through GPS matching, skill badges and training.",
      },
    ],
  }),
  component: Home,
});

const steps = [
  { t: "Register with GPS", d: "Workers and employers pin their exact location during signup." },
  { t: "AI matches nearby", d: "40% skills · 30% distance · 20% experience · 10% ratings." },
  { t: "Apply & get hired", d: "One-click apply, employer shortlists straight from the dashboard." },
  { t: "Paid & rated", d: "Wallet tracks earnings, both sides rate each other." },
];

function Home() {
  const { jobs, location, radius } = useStore();
  const near = jobs.filter((j) => haversine(location, j) <= radius);
  const weekend = jobs.filter((j) => j.type === "Weekend");

  return (
    <div>
      <section className="hero-gradient relative overflow-hidden">
        <img
          src={heroImg}
          alt="Local electricians, retail staff, delivery riders and factory workers at work"
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-28">
          <div className="text-primary-foreground">
            <Badge className="border-0 bg-accent text-accent-foreground">SDG 8 · Decent Work & Economic Growth</Badge>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Find Local Jobs Near You
            </h1>
            <p className="mt-4 max-w-xl text-lg opacity-90">
              SkillBridge connects workers and employers within a 4–8 km radius — daily wage, weekend shifts,
              part-time and contract work, matched by GPS and skill badges.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/jobs">
                  <Search className="mr-2 size-4" /> Find Jobs
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/hire">
                  <Briefcase className="mr-2 size-4" /> Hire Workers
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                { n: near.length, l: `Jobs within ${radius} km` },
                { n: workers.length, l: "Verified workers" },
                { n: employers.length, l: "Local employers" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-bold">{s.n}</div>
                  <div className="text-xs opacity-80">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel self-center p-6">
            <h2 className="font-display text-lg font-bold">Quick start</h2>
            <div className="mt-4 grid gap-3">
              <Link to="/register" search={{ role: "worker" }} className="rounded-lg border border-border p-4 transition-shadow hover:shadow-card">
                <div className="flex items-center gap-2 font-semibold">
                  <MapPin className="size-4 text-primary" /> I'm looking for work
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Register with skills, GPS location and availability — get matched instantly.
                </p>
              </Link>
              <Link to="/register" search={{ role: "employer" }} className="rounded-lg border border-border p-4 transition-shadow hover:shadow-card">
                <div className="flex items-center gap-2 font-semibold">
                  <Briefcase className="size-4 text-primary" /> I'm hiring
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Post a job and see ranked local candidates in seconds.
                </p>
              </Link>
              <Link to="/support" className="rounded-lg border border-border p-4 transition-shadow hover:shadow-card">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="size-4 text-primary" /> I need help
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Customer care portal · helpline 1800-000-SKILL</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">How the system works, end to end</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.t} className="panel p-5">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-3 font-display text-base font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold">Weekend work, skilled & unskilled</h2>
              <p className="mt-1 text-muted-foreground">
                Saturday–Sunday shifts for students, homemakers and anyone earning a second income.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/jobs" search={{ type: "Weekend" }}>
                <CalendarDays className="mr-2 size-4" /> See all weekend jobs
              </Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {weekend.slice(0, 3).map((j) => (
              <div key={j.id} className="panel p-5">
                <Badge variant="secondary">{j.type}</Badge>
                <h3 className="mt-2 font-display text-lg font-bold">{j.title}</h3>
                <p className="text-sm text-muted-foreground">{j.area} · {haversine(location, j).toFixed(1)} km away</p>
                <p className="mt-3 font-semibold text-primary">
                  ₹{j.salary.toLocaleString("en-IN")}/{j.payPeriod}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{j.skills.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-16 md:grid-cols-3">
        {[
          { icon: Radar, t: "GPS radius search", d: "Both sides see a live radar of matches within 1–15 km.", to: "/jobs" },
          { icon: GraduationCap, t: "Skill training & badges", d: "Courses plus Bronze→Platinum badges from verified certificates.", to: "/training" },
          { icon: Wallet, t: "Wallet & financial aid", d: "Track earnings, pending payments and government schemes.", to: "/finance" },
        ].map((c) => (
          <Link key={c.t} to={c.to} className="panel p-6 transition-shadow hover:shadow-lift">
            <c.icon className="size-6 text-primary" />
            <h3 className="mt-3 font-display text-lg font-bold">{c.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
