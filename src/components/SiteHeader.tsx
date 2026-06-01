import { Link } from "@tanstack/react-router";
import logo from "@/assets/fondo-logo.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Fondo logo" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-xl font-extrabold text-foreground">Fondo</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/upload"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Analyze your finances
          </Link>
        </nav>
      </div>
    </header>
  );
}
