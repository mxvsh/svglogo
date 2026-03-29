export function getInitials(name: string | null | undefined, fallback: string): string {
  if (!name?.trim()) return fallback.slice(0, 1).toUpperCase();
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
