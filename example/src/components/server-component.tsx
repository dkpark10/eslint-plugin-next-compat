// Server Component - no "use client" directive
// Should NOT show compat warnings even with incompatible APIs

export default function ServerComponent() {
  // These are fine in server components - they run on Node.js
  const cloned = structuredClone({ server: true });
  const arr = [1, 2, 3];
  const last = arr.at(-1);

  return (
    <div>
      <p>Server Component</p>
      <p>Cloned: {JSON.stringify(cloned)}</p>
      <p>Last: {last}</p>
    </div>
  );
}
