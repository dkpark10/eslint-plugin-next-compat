export default function ChildNoDirective() {
  const cloned = structuredClone({ nested: true });

  return (
    <div>
      <p>Cloned: {JSON.stringify(cloned)}</p>
    </div>
  );
}
