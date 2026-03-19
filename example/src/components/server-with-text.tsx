// Server Component - this is NOT a client component
// The "use client" text below is just a string, not a directive

export default function ServerWithText() {
  // This text contains "use client" but it's not a directive
  const instructions = `
    To make a client component, add "use client" at the top of your file.
    The directive must be the first line of the file.
  `;

  const codeExample = 'use client'; // This is just a string variable

  // Server-side code using Node.js APIs (no compat issues needed)
  const data = structuredClone({ message: 'Hello from server' });

  return (
    <div>
      <h2>Server Component with "use client" text</h2>
      <p>This is a server component, not a client component.</p>
      <pre>{instructions}</pre>
      <code>Directive example: {codeExample}</code>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}
