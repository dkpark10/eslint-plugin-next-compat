// Storage utility - no "use client"
// Uses browser APIs (localStorage, sessionStorage)
// Should show warnings when used in client component chain

export function getLocalStorage(key) {
  return localStorage.getItem(key);
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

export function getSessionStorage(key) {
  return sessionStorage.getItem(key);
}

export function clearAllStorage() {
  localStorage.clear();
  sessionStorage.clear();
}
