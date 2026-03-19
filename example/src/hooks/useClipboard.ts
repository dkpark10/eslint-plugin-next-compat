import { useState, useCallback } from 'react';

// Custom hook using Clipboard API
// Will be part of client bundle when imported by client component
export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    // navigator.clipboard - browser API with compat considerations
    await navigator.clipboard.writeText(text);
    setCopied(true);

    // AbortSignal.timeout - relatively new API
    const signal = AbortSignal.timeout(2000);
    signal.addEventListener('abort', () => setCopied(false));
  }, []);

  return { copied, copy };
}
