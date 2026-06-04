const KEY = "fondo-session";

export interface FondoSession {
  fileName: string;
  analysis: string;
  sessionId: string;
}

export function saveSession(session: FondoSession) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function loadSession(): FondoSession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FondoSession) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
