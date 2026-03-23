import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // ResizeObserver - browser API that may have compat issues
    const observer = new ResizeObserver(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });

    observer.observe(document.body);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    console.log('Dark mode:', mediaQuery.matches);

    return () => observer.disconnect();
  }, []);

  return size;
}
