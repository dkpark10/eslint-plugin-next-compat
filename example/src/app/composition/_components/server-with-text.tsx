// Server Component with text content

export default function ServerWithText() {
  const data = structuredClone({ text: 'Hello from server' });

  return (
    <div>
      <p>Server With Text</p>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}
