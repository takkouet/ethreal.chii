/** VND is stored as integer (no minor unit). Format as "1.234.567 VND". */
export function formatVnd(amount: number): string {
  const grouped = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${grouped} VND`;
}
