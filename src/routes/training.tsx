import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Skill Training & Badges — SkillBridge" },
      { name: "description", content: "Short courses in electrical, plumbing, retail, computers and more — earn verified skill badges." },
      { property: "og:title", content: "Skill Training & Badges — SkillBridge" },
      { property: "og:description", content: "Free and paid courses that raise your badge tier and match score." },
    ],
  }),
  component: Training,
});

const courses = [
  { n: "Electrician Basics", d: "Wiring, safety, fault finding.", w: "6 weeks", free: true },
  { n: "Carpentry", d: "Joinery, finishing, measurement.", w: "8 weeks", free: true },
  { n: "Plumbing", d: "Fittings, drainage, leak repair.", w: "6 weeks", free: true },
  { n: "Retail Sales", d: "Customer handling, billing, upselling.", w: "3 weeks", free: true },
  { n: "Computer Basics", d: "Typing, files, internet, email.", w: "4 weeks", free: true },
  { n: "Digital Marketing", d: "Social media, ads, analytics.", w: "6 weeks", free: false },
  { n: "Data Entry", d: "Speed, accuracy, spreadsheets.", w: "3 weeks", free: true },
  { n: "Tailoring", d: "Stitching, patterns, alterations.", w: "8 weeks", free: false },
];

const tiers = [
  { t: "Bronze", d: "New worker — profile complete." },
  { t: "Silver", d: "1+ year experience or a completed course." },
  { t: "Gold", d: "Verified certificate, 3+ years, 4.0+ rating." },
  { t: "Platinum", d: "Verified expert — top of every match list." },
];

function Training() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Skill Training</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Every completed course adds a verified skill to your profile and lifts your badge tier — which directly raises
        your ranking in employer searches.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {courses.map((c) => (
          <div key={c.n} className="panel flex flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-base font-bold">{c.n}</h3>
              <Badge variant={c.free ? "default" : "secondary"}>{c.free ? "Free" : "Paid"}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
            <p className="mt-2 text-xs text-muted-foreground">{c.w} · certificate on completion</p>
            <Button size="sm" className="mt-4" onClick={() => toast.success(`Enrolled in ${c.n}`)}>
              Enroll
            </Button>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-xl font-bold">Skill badges for workers & employers</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-4">
        {tiers.map((t) => (
          <div key={t.t} className="panel p-5">
            <h3 className="font-display text-base font-bold">{t.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Employers earn matching badges too — based on verified licence, on-time payments and worker ratings.
      </p>
    </div>
  );
}
