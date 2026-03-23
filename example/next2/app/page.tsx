"use client";

export default function ClientComponent() {
  const cloned = structuredClone({ a: 1 });

  return <>{JSON.stringify(cloned)}</>;
}
