'use client';

import { useBrowserInfo } from '../hooks/useBrowserInfo';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatDate, capitalize } from '../utils/format';

// Client component with deep dependency chain:
// this component
//   → useBrowserInfo hook
//       → browser-api.ts utility (has navigator, screen APIs)
//   → useLocalStorage hook
//       → storage.ts utility (has localStorage, sessionStorage APIs)
//   → format.ts utility (no browser APIs - should not warn)

export default function ClientDeepDeps() {
  const browserInfo = useBrowserInfo();
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <div>
      <h2>{capitalize('deep dependency example')}</h2>
      <p>Date: {formatDate(new Date())}</p>
      <p>Theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      {browserInfo && (
        <div>
          <p>User Agent: {browserInfo.userAgent}</p>
          <p>Screen: {browserInfo.screenWidth}x{browserInfo.screenHeight}</p>
        </div>
      )}
    </div>
  );
}
