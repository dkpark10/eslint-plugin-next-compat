/**
 * block comment
 */
"use client";

import dynamic from "next/dynamic";
import { lazy, Suspense, useState } from "react";

const ReactLazyComponent = lazy(() => import("@/app/lazy-loading/_components/lazy-component"));

const DynamicComponent = dynamic(
  () => import("@/app/lazy-loading/_components/dynamic-component"),
  {
    ssr: false,
  },
);

export default function LazyLoadingPage() {
  const [LazyComponent, setLazyComponent] = useState(null);

  const onClick = () => {
    const Component = lazy(
      () => import("@/app/lazy-loading/_components/click-to-load-component"),
    );
    setLazyComponent(() => Component);
  };

  return (
    <main>
      <Suspense fallback={<p>Loading React.lazy...</p>}>
        <ReactLazyComponent />
      </Suspense>

      <DynamicComponent />

      <button onClick={onClick}>Load Component</button>

      {LazyComponent && (
        <Suspense fallback={<p>Loading...</p>}>
          <LazyComponent />
        </Suspense>
      )}
    </main>
  );
}
