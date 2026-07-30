import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Financial Assistance — SkillBridge" },
      { name: "description", content: "Government schemes, emergency loans, scholarships and financial literacy for local workers." },
      { property: "og:title", content: "Financial Assistance — SkillBridge" },
      { property: "og:description", content: "PMKVY, Mudra Loan, Startup India and more support for workers." },
    ],
  }),
  component: Finance,
});

const schemes = [
  { n: "PMKVY", d: "Free short-term skill training with certification and placement support.", tag: "Skill" },
  { n: "Mudra Loan", d: "Collateral-free loans up to ₹10 lakh for micro-enterprises.", tag: "Loan" },
  { n: "Startup India", d: "Seed funding, tax benefits and mentorship for new ventures.", tag: "Business" },
  { n: "Skill India Digital", d: "Free online courses with government-recognised certificates.", tag: "Skill" },
];

function Finance() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Financial Assistance</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Employability is not only about jobs. These programmes help workers reduce risk, upskill and grow.
      </p>

      <h2 className="mt-8 font-display text-xl font-bold">Government schemes</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {schemes.map((s) => (
          <div key={s.n} className="panel p-5">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{s.tag}</span>
            <h3 className="mt-2 font-display text-lg font-bold">{s.n}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { t: "Financial literacy", d: "Budgeting a daily wage, saving for lean weeks, avoiding informal high-interest debt." },
          { t: "Emergency loans", d: "Verified workers with a Gold or Platinum badge can request advance against pending wallet payments." },
          { t: "Scholarships & career guidance", d: "Education support for workers' children plus 1:1 counselling on career paths." },
        ].map((c) => (
          <div key={c.t} className="panel p-5">
            <h3 className="font-display text-base font-bold">{c.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
