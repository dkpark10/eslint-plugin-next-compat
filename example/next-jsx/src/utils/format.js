// Shared utility - used by BOTH server and client components
// No browser APIs here - should not show warnings

export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
