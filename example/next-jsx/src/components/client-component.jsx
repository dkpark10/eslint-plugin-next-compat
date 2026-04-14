"use client";

import { useEffect } from "react";
import data from './json/data.json';

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

  const cloned = structuredClone(data);
  console.log(cloned);

  return (
    <button type="button">click</button>
  );
}
