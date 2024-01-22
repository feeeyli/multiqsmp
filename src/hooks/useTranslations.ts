/* eslint-disable prefer-spread */
import { useAppVariant } from '@/contexts/app-variant-context';
import { useTranslations as useTranslationsNI } from 'next-intl';

export function useTranslations(namespace?: string) {
  const t = useTranslationsNI(namespace);
  const variant = useAppVariant();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function translate(...rest: any) {
    if (variant === 'qsmp')
      return t.apply(null, rest);

    return t
      .apply(null, rest)
      .replaceAll('MultiQSMP', 'MultiFrogg')
      .replaceAll('QSMP', 'Frogg SMP');
  }

  return translate;
}
