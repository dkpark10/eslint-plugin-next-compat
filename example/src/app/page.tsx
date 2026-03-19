import ClientComponent from '@/components/client-component';
import ClientWithHooks from '@/components/client-with-hooks';
import ClientWrapper from '@/components/client-wrapper';
import ClientDeepDeps from '@/components/client-deep-deps';
import ServerComponent from '@/components/server-component';
import ServerWithText from '@/components/server-with-text';

// Server Component - should NOT show compat warnings
export default function Home() {
  // This is fine in server component
  const data = structuredClone({ test: 1 });

  return (
    <main>
      <h1>ESLint Plugin Next Compat Example</h1>
      <p>Server rendered data: {JSON.stringify(data)}</p>

      {/* Client components - SHOULD show compat warnings */}
      <ClientComponent />
      <ClientWithHooks />
      <ClientDeepDeps />

      {/* Composition: Client wrapper with server children */}
      <ClientWrapper>
        <ServerComponent />
        <ServerWithText />
      </ClientWrapper>

      {/* Server components - should NOT show compat warnings */}
      <ServerComponent />
      <ServerWithText />
    </main>
  );
}
