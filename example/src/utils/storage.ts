// Storage utility - no "use client"
// Uses browser APIs (localStorage, sessionStorage)
// Should show warnings when used in client component chain

export function getLocalStorage(key: string): string | null {
  return localStorage.getItem(key);
}

export function setLocalStorage(key: string, value: string): void {
  localStorage.setItem(key, value);
}

export function getSessionStorage(key: string): string | null {
  return sessionStorage.getItem(key);
}

export function clearAllStorage(): void {
  localStorage.clear();
  sessionStorage.clear();
}
