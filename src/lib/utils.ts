export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}·${m}·${d}`;
}

export function formatShortDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}·${d}`;
}

export function recordNumber(index: number, total: number): string {
  return String(total - index).padStart(3, '0');
}
