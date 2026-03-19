import ClientWrapper from "./_components/client-wrapper";
import ServerComponent from "./_components/server-component";

export default function CompositionPage() {
  return (
    <main>
      <ClientWrapper>
        <ServerComponent />
      </ClientWrapper>
    </main>
  );
}
