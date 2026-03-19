export default function ServerComponent() {
  const cloned = structuredClone({ server: true });

  return (
    <div>
      {JSON.stringify(cloned)}
    </div>
  );
}
