'use client';

import { useBrowserInfo } from '@/hooks/useBrowserInfo';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useClipboard } from '@/hooks/useClipboard';
import { useWindowSize } from '@/hooks/useWindowSize';
import { formatDate, capitalize } from '@/utils/format';

export default function ClientDeepDeps() {
  useBrowserInfo();
  useLocalStorage('theme', 'light');
  useClipboard();
  useWindowSize();

  return (
    <>
      <h2>{capitalize('deep dependency example')}</h2>
      <p>Date: {formatDate(new Date())}</p>
    </>
  );
}
