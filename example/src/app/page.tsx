import ClientComponent from '@/components/client-component';

// Server Component - should NOT show compat warnings
export default function Home() {
  // This is fine in server component
  const data = structuredClone({ test: 1 });

  return (
    <main>
      <h1>ESLint Plugin Next Compat Example</h1>
      <p>Server rendered data: {JSON.stringify(data)}</p>
      <ClientComponent />
    </main>
  );
}
