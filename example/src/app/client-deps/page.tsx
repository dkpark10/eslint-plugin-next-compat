'use client';

import { useBrowserInfo } from '@/hooks/useBrowserInfo';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useClipboard } from '@/hooks/useClipboard';
import { useWindowSize } from '@/hooks/useWindowSize';
import { formatDate, capitalize } from '@/utils/format';

export default function ClientDeepDeps() {
  const browserInfo = useBrowserInfo();
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  useClipboard();
  useWindowSize();

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
