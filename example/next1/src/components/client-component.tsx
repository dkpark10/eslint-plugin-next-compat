"use client";

import { useEffect } from "react";

export default function ClientComponent() {
  useEffect(() => {
    const observer = new IntersectionObserver(() => {
      //
    });

    const resizeObserver = new ResizeObserver(() => {
      //
    });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  const cloned = structuredClone({ test: "value" });
  console.log(cloned);

  return null;
}
