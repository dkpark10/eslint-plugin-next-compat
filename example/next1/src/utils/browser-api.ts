// Deep utility - no "use client" but has browser APIs
// Should be detected when imported by client component chain

export function getBrowserInfo() {
  // Navigator API
  const userAgent = navigator.userAgent;

  // Screen API
  const screenWidth = screen.width;
  const screenHeight = screen.height;

  return { userAgent, screenWidth, screenHeight };
}

export function vibrate(pattern: number[]) {
  // Vibration API - limited browser support
  navigator.vibrate(pattern);
}
