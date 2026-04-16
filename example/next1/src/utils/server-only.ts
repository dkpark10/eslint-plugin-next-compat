import 'server-only';

export function getServerData() {
  structuredClone({ server: true });
  return 'server only';
}
