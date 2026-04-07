/** @format */

export function capitalize(str: string | null): string {
  if (!str) return "";

  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function calculateAverage(numbers: number[] | null): number {
  if (!numbers || numbers.length === 0) return 0;

  const sum = numbers.reduce((acc, n) => acc + n, 0);
  const avg = sum / numbers.length;

  return Number(avg.toFixed(2));
}

export function slugify(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .normalize("NFD") // enlève accents
    .replace(/[\u0300-\u036f]/g, "") // caractères diacritiques
    .replace(/[^a-z0-9\s-]/g, "") // supprime caractères spéciaux
    .replace(/\s+/g, "-") // espaces → tirets
    .replace(/-+/g, "-") // évite plusieurs tirets
    .replace(/^-+|-+$/g, ""); // supprime tirets en début/fin
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
