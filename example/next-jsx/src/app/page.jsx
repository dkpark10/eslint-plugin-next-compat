import ClientComponent from "@/components/client-component";
import ServerComponent from "@/components/server-component";

export default function Page() {
  return (
    <main>
      <ServerComponent />
      <ClientComponent />
    </main>
  );
}
