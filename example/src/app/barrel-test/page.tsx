// Page that uses barrel imports
// Tests if dependency tracking works through index.ts re-exports

import {
  ClientComponent,
  ClientDeepDeps,
  ServerComponent,
} from '@/components';
import { formatCurrency } from '@/utils/format';

export default function BarrelTestPage() {
  const price = formatCurrency(99.99);

  return (
    <main>
      <h1>Barrel Import Test</h1>
      <p>Price: {price}</p>
      <ClientComponent />
      <ClientDeepDeps />
      <ServerComponent />
    </main>
  );
}
