import { useState } from "react";
import { Crosshair, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useStore, store } from "@/lib/use-store";
import { CITY, haversine } from "@/lib/skillbridge";

type Pin = { id: string; lat: number; lng: number; label: string; kind: "job" | "worker" };

/** Shared GPS interface: live geolocation, radius control and a radar map of nearby pins. */
export function GpsPanel({ pins, subject }: { pins: Pin[]; subject: "jobs" | "workers" }) {
  const { location, radius } = useStore();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function locate() {
    setErr(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setErr("Geolocation is not available on this device.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        store.set({
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: `Live GPS · ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          },
        });
        setBusy(false);
      },
      () => {
        setErr("Location permission denied — using your saved area instead.");
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  const inRange = pins.filter((p) => haversine(location, p) <= radius);

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold">GPS Radius Search</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" /> {location.label}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={locate} disabled={busy}>
          {busy ? <Loader2 className="mr-1 size-4 animate-spin" /> : <Crosshair className="mr-1 size-4" />}
          Use my location
        </Button>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Search radius</span>
          <span className="font-semibold">{radius} km</span>
        </div>
        <Slider
          className="mt-2"
          min={1}
          max={15}
          step={1}
          value={[radius]}
          onValueChange={([v]) => store.set({ radius: v })}
        />
      </div>

      <div className="radar-grid relative mt-4 aspect-square w-full overflow-hidden rounded-xl border border-border">
        {[1, 0.66, 0.33].map((r) => (
          <div
            key={r}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25"
            style={{ width: `${r * 92}%`, height: `${r * 92}%` }}
          />
        ))}
        <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-primary/20" />
        {pins.map((p) => {
          const km = haversine(location, p);
          const scale = Math.min(1, km / radius);
          const angle = Math.atan2(p.lat - location.lat, p.lng - location.lng);
          const x = 50 + Math.cos(angle) * scale * 46;
          const y = 50 - Math.sin(angle) * scale * 46;
          const near = km <= radius;
          return (
            <div
              key={p.id}
              title={`${p.label} · ${km.toFixed(1)} km`}
              className={`absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                near ? (p.kind === "job" ? "bg-accent" : "bg-success") : "bg-muted-foreground/30"
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          );
        })}
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-card/90 px-2 py-0.5 text-[10px] text-muted-foreground">
          {CITY.name} · live radar
        </span>
      </div>

      <p className="mt-3 text-sm">
        <span className="font-semibold text-primary">{inRange.length}</span> {subject} within {radius} km
      </p>
      {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
    </div>
  );
}
