// lib/slugify.ts

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove punctuation
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with dashes
}
