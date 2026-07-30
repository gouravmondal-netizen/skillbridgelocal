import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { store, useStore } from "@/lib/use-store";
import { uid } from "@/lib/skillbridge";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Customer Care Portal — SkillBridge" },
      { name: "description", content: "Raise a support ticket, track its status, or reach the SkillBridge helpline for workers and employers." },
      { property: "og:title", content: "Customer Care Portal — SkillBridge" },
      { property: "og:description", content: "Support tickets, helpline and FAQs for workers and employers." },
    ],
  }),
  component: Support,
});

const faqs = [
  { q: "A job was posted but nobody contacted me", a: "Check your radius setting on the Find Jobs page — matches outside your radius are hidden." },
  { q: "My payment is still pending", a: "Employers release payouts after job completion. Raise a Payment ticket if it is pending beyond 7 days." },
  { q: "How do I get a verified badge?", a: "Upload a government or training certificate from your dashboard; admin verification takes 24–48 hours." },
];

function Support() {
  const { tickets } = useStore();
  const [form, setForm] = useState({ name: "", role: "Worker", category: "Payment", message: "" });

  function submit() {
    if (!form.name.trim() || form.message.trim().length < 10) {
      toast.error("Add your name and a message of at least 10 characters.");
      return;
    }
    store.set((s) => ({
      tickets: [
        {
          id: uid(),
          name: form.name.trim().slice(0, 60),
          role: form.role,
          category: form.category,
          message: form.message.trim().slice(0, 800),
          status: "Open" as const,
          date: new Date().toISOString().slice(0, 10),
        },
        ...s.tickets,
      ],
    }));
    setForm({ ...form, message: "" });
    toast.success("Ticket raised", { description: "Our care team responds within 4 working hours." });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Customer Care Portal</h1>
      <p className="mt-1 text-muted-foreground">Support for both workers and employers — in your language.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="panel p-6">
          <h2 className="font-display text-lg font-bold">Raise a ticket</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="n">Your name</Label>
              <Input id="n" value={form.name} maxLength={60} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>I am a</Label>
              <div className="mt-2 flex gap-2">
                {["Worker", "Employer"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setForm({ ...form, role: r })}
                    className={`rounded-full border px-3 py-1 text-xs ${form.role === r ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Category</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Payment", "Job issue", "Account", "Safety", "Other"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, category: c })}
                    className={`rounded-full border px-3 py-1 text-xs ${form.category === c ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="m">How can we help?</Label>
              <Textarea id="m" maxLength={800} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
          </div>
          <Button className="mt-4" onClick={submit}>Submit ticket</Button>

          <h3 className="mt-8 font-display text-base font-bold">My tickets</h3>
          <div className="mt-3 space-y-2">
            {tickets.length === 0 && <p className="text-sm text-muted-foreground">No tickets raised yet.</p>}
            {tickets.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3 text-sm">
                <Badge variant="secondary">{t.category}</Badge>
                <span className="min-w-0 flex-1 truncate">{t.message}</span>
                <span className="text-xs text-muted-foreground">{t.date}</span>
                <Badge>{t.status}</Badge>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="panel p-6">
            <h2 className="font-display text-lg font-bold">Reach us</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="size-4 text-primary" /> 1800-000-SKILL (toll free)</li>
              <li className="flex items-center gap-2"><Mail className="size-4 text-primary" /> care@skillbridge.in</li>
              <li className="flex items-center gap-2"><MessageSquare className="size-4 text-primary" /> WhatsApp support 8am–10pm</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Available in English, हिन्दी, ಕನ್ನಡ, தமிழ், తెలుగు and বাংলা.
            </p>
          </div>
          <div className="panel p-6">
            <h2 className="font-display text-lg font-bold">Common questions</h2>
            <div className="mt-3 space-y-3 text-sm">
              {faqs.map((f) => (
                <div key={f.q}>
                  <p className="font-medium">{f.q}</p>
                  <p className="text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
