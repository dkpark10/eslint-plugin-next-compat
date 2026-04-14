export default function ServerComponent() {
  const cloned = structuredClone({ server: true });

  return (
    <div>
      {/* use client directive  */}
      <p>use client</p>
      <p>{JSON.stringify(cloned)}</p>
    </div>
  );
}
