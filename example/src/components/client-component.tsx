'use client';

import { useEffect, useState } from 'react';

// Client Component - SHOULD show compat warnings for incompatible APIs
export default function ClientComponent() {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    // IntersectionObserver - may show warning depending on browserslist
    const observer = new IntersectionObserver((entries) => {
      setIsIntersecting(entries[0]?.isIntersecting ?? false);
    });

    // ResizeObserver - may show warning depending on browserslist
    const resizeObserver = new ResizeObserver((entries) => {
      console.log('Resized:', entries);
    });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  // structuredClone - may show warning depending on browserslist
  const cloned = structuredClone({ test: 'value' });

  // Array.prototype.at - may show warning depending on browserslist
  const arr = [1, 2, 3];
  const last = arr.at(-1);

  return (
    <div>
      <p>Client Component</p>
      <p>Is intersecting: {String(isIntersecting)}</p>
      <p>Cloned: {JSON.stringify(cloned)}</p>
      <p>Last item: {last}</p>
    </div>
  );
}
