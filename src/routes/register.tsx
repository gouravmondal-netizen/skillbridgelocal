import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store, useStore } from "@/lib/use-store";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>) => ({ role: s.role === "employer" ? "employer" : "worker" }),
  head: () => ({
    meta: [
      { title: "Register or Login — SkillBridge" },
      { name: "description", content: "Create a worker or employer account with GPS location, skills and availability." },
      { property: "og:title", content: "Register or Login — SkillBridge" },
      { property: "og:description", content: "Join SkillBridge as a local worker or a local employer." },
    ],
  }),
  component: Register,
});

function Register() {
  const { role } = Route.useSearch();
  const navigate = useNavigate();
  const { location } = useStore();
  const [tab, setTab] = useState<"worker" | "employer">(role as "worker" | "employer");
  const [busy, setBusy] = useState(false);

  function locate() {
    if (typeof navigator === "undefined" || !navigator.geolocation) return toast.error("Geolocation unavailable");
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        store.set({
          location: {
            lat: p.coords.latitude,
            lng: p.coords.longitude,
            label: `Live GPS · ${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`,
          },
        });
        setBusy(false);
        toast.success("Location captured");
      },
      () => {
        setBusy(false);
        toast.error("Permission denied — keeping your saved area");
      },
    );
  }

  function submit() {
    toast.success(tab === "worker" ? "Worker profile created" : "Company profile created");
    navigate({ to: tab === "worker" ? "/worker" : "/employer" });
  }

  const workerFields = [
    ["Full name", "Ravi Kumar"], ["Age", "28"], ["Phone number", "+91 90000 10001"], ["Email", "ravi@mail.com"],
    ["Qualification", "ITI / 12th Pass"], ["Skills (comma separated)", "Electrician, Wiring"],
    ["Experience (years)", "4"], ["Expected salary (₹)", "900 per day"],
    ["Preferred job type", "Daily Wage / Weekend / Part Time / Contract"], ["Availability", "Immediate / Weekends only"],
  ];
  const employerFields = [
    ["Company name", "ABC Retail Mart"], ["Industry", "Retail"], ["Address", "12th Main, Jayanagar"],
    ["Phone", "+91 98450 11111"], ["Email", "hr@abcretail.in"], ["Company licence no.", "KA-RTL-99213"],
    ["GST (optional)", "29ABCDE1234F1Z5"], ["Company size", "50-200"],
  ];
  const fields = tab === "worker" ? workerFields : employerFields;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <div className="mt-4 flex gap-2">
        {(["worker", "employer"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-1.5 text-sm capitalize ${tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
          >
            {t} registration
          </button>
        ))}
      </div>

      <div className="panel mt-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([label, ph]) => (
            <div key={label} className={label.startsWith("Skills") || label === "Address" ? "sm:col-span-2" : ""}>
              <Label htmlFor={label}>{label}</Label>
              <Input id={label} placeholder={ph} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Label>Upload photo / certificates {tab === "employer" && "· licence document"}</Label>
            <Input type="file" multiple className="mt-1" />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-border p-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">GPS location</p>
            <p className="truncate text-xs text-muted-foreground">{location.label}</p>
          </div>
          <Button variant="outline" size="sm" onClick={locate} disabled={busy}>
            <Crosshair className="mr-1 size-4" /> Capture GPS
          </Button>
        </div>

        <Button className="mt-6 w-full" onClick={submit}>
          {tab === "worker" ? "Create worker profile" : "Create company profile"}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Already registered? This prototype signs you straight into the demo account.
        </p>
      </div>
    </div>
  );
}
