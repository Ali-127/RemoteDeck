const STORAGE_KEY = "remotedeck_pc_url";

export function getSavedPcUrl(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function savePcUrl(url: string) {
  localStorage.setItem(STORAGE_KEY, url);
}

export async function verifyPairing(url: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}/pair`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.service === "remotedeck";
  } catch {
    return false;
  }
}
