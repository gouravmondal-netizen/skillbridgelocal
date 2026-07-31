import { useEffect, useState } from "react";
import { useTaglines } from "@/lib/i18n";

export function RotatingTagline({ className }: { className?: string }) {
  const taglines = useTaglines();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % 3), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} aria-live="polite">
      <span key={i} className="inline-block animate-in fade-in slide-in-from-bottom-1 duration-500">
        {taglines[i]}
      </span>
    </span>
  );
}

export function TaglineStrip() {
  const taglines = useTaglines();
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
      {taglines.map((t, idx) => (
        <span key={t} className="flex items-center gap-4">
          {idx > 0 && <span className="text-primary">·</span>}
          {t}
        </span>
      ))}
    </div>
  );
}
