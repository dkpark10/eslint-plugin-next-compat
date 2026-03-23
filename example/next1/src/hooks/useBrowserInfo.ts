import { useState, useEffect } from 'react';
import { getBrowserInfo } from '../utils/browser-api';

// Hook that imports from deep utility
// No "use client" but uses browser-api.ts which has browser APIs
// The whole chain should be detected as client code

export function useBrowserInfo() {
  const [info, setInfo] = useState<ReturnType<typeof getBrowserInfo> | null>(null);

  useEffect(() => {
    setInfo(getBrowserInfo());
  }, []);

  return info;
}
