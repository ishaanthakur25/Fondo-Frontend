import { Link } from "@tanstack/react-router";
import logo from "@/assets/fondo-logo.png";

const LINKS = [
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/mobile", label: "Mobile App" },
  { to: "/contact", label: "Contact" },
  { to: "/upload", label: "Upload" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="Fondo logo" width={32} height={32} className="h-8 w-8" />
              <span className="font-display text-xl font-extrabold tracking-tight">Fondo</span>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70">
              Your AI CFO. Built for founders like you.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-primary-foreground/75 transition-colors hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Fondo. Built for the next generation of founders.</p>
          <p className="font-medium text-accent">Free forever. No credit card required.</p>
        </div>
      </div>
    </footer>
  );
}
