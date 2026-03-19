'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode; // Server components can be passed as children
}

// Client component that wraps children (composition pattern)
// Server components passed as children stay server components
export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // IntersectionObserver - browser API
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setMounted(true);
      }
    });

    // BroadcastChannel - browser API with compat issues
    const channel = new BroadcastChannel('my-channel');
    channel.postMessage({ type: 'mounted' });

    return () => {
      observer.disconnect();
      channel.close();
    };
  }, []);

  return (
    <div className="client-wrapper">
      <p>Client Wrapper (mounted: {String(mounted)})</p>
      {/* Server components passed as children */}
      {children}
    </div>
  );
}
