import ClientWrapper from "@/app/composition/_components/client-wrapper";
import ServerComponent from "@/app/composition/_components/server-component";

export default function CompositionPage() {
  return (
    <main>
      <ClientWrapper>
        <ServerComponent />
      </ClientWrapper>
    </main>
  );
}
