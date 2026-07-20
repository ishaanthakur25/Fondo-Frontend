import { useEffect, useState, useCallback } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "fondo-pwa-banner-dismissed";

function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) setInstalled(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }, [deferred]);

  return { canInstall: !!deferred && !installed, installed, install };
}

export function InstallAppButton({ className = "" }: { className?: string }) {
  const { canInstall, install } = useInstallPrompt();
  if (!canInstall) return null;
  return (
    <button
      onClick={install}
      className={
        "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 " +
        className
      }
      style={{ backgroundColor: "#00C896", color: "#0F1F3D" }}
    >
      <Download className="h-4 w-4" />
      Install App
    </button>
  );
}

export function MobileInstallBanner() {
  const { canInstall, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (!isMobile || dismissed || !canInstall) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0F1F3D] p-3 text-white shadow-2xl">
      <div className="flex-1 text-sm leading-snug">
        Add Fondo to your home screen for the best experience
      </div>
      <button
        onClick={install}
        className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold"
        style={{ backgroundColor: "#00C896", color: "#0F1F3D" }}
      >
        Install
      </button>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
