// lib/formatDate.ts

export function formatDate(date: Date, locale: string = 'en') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
