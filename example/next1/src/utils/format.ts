// Shared utility - used by BOTH server and client components
// No browser APIs here - should not show warnings

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
