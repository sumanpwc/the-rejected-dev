// /lib/i18n.ts

import { useRouter } from 'next/router';

export function useLocale() {
  const { locale, defaultLocale } = useRouter();
  return locale || defaultLocale || 'en';  // fallback if undefined
}
