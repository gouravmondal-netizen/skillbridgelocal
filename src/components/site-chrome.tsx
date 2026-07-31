import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { RotatingTagline, TaglineStrip } from "@/components/tagline";
import { useLang } from "@/lib/i18n";

const links = [
  { to: "/", key: "nav.home" },
  { to: "/jobs", key: "nav.jobs" },
  { to: "/hire", key: "nav.hire" },
  { to: "/finance", key: "nav.finance" },
  { to: "/training", key: "nav.training" },
  { to: "/support", key: "nav.support" },
  { to: "/admin", key: "nav.admin" },
] as const;


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold tracking-tight">SkillBridge</span>
            <RotatingTagline className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:block" />
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground font-medium" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <LanguageSwitcher />
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <Link to="/worker">{t("nav.worker")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register">{t("nav.login")}</Link>
          </Button>
          <button
            className="rounded-md p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-border bg-card px-4 py-3 lg:hidden">
          {[
            ...links.map((l) => ({ to: l.to as string, key: l.key as string })),
            { to: "/worker", key: "nav.worker" },
            { to: "/employer", key: "nav.employer" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}


export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-base font-bold">SkillBridge</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Hyperlocal employment for daily wage, weekend and contract work within 4–8 km.
          </p>
          <p className="mt-3 text-xs font-medium text-primary">Supporting UN SDG 8 — Decent Work & Economic Growth</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">For Workers</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/jobs">Find Jobs</Link></li>
            <li><Link to="/worker">Dashboard & Wallet</Link></li>
            <li><Link to="/training">Skill Training</Link></li>
            <li><Link to="/finance">Financial Assistance</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">For Employers</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/hire">Post a Job</Link></li>
            <li><Link to="/employer">Employer Dashboard</Link></li>
            <li><Link to="/admin">Platform Analytics</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Help</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/support">Customer Care Portal</Link></li>
            <li>Helpline: 1800-000-SKILL</li>
            <li>care@skillbridge.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        Prototype build · data stored locally in your browser
      </div>
    </footer>
  );
}
