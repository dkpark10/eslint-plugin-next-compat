'use client';

import { useWindowSize } from '../hooks/useWindowSize';
import { useClipboard } from '../hooks/useClipboard';

// Client component that uses custom hooks
// The hooks don't have "use client" but they're imported here,
// so they become client code and SHOULD show compat warnings
export default function ClientWithHooks() {
  const { width, height } = useWindowSize();
  const { copied, copy } = useClipboard();

  return (
    <div>
      <h2>Client Component with Hooks</h2>
      <p>
        Window size: {width} x {height}
      </p>
      <button onClick={() => copy('Hello!')}>
        {copied ? 'Copied!' : 'Copy to clipboard'}
      </button>
    </div>
  );
}
