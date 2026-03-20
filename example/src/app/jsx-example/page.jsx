"use client";

import { useClipboard } from "@/hooks/useClipboard";
import { useEffect } from "react";

export default function JsxExamplePage() {
  const { copy } = useClipboard();

  useEffect(() => {
    const observer = new IntersectionObserver(() => {
    });

    const resizeObserver = new ResizeObserver(() => {
    });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>JSX Example</h1>
      <button onClick={() => copy("Hello!")}>Copy</button>
    </div>
  );
}
