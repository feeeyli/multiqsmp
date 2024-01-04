// Next Imports
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Libs Imports
import { NextIntlClientProvider } from 'next-intl';
import { CustomGroupsProvider } from '@/contexts/custom-groups-context';
import { EasterEggsProvider } from '@/contexts/easter-eggs-context';
import { LayoutMemoryProvider } from '@/contexts/layout-memory-context';

// Components Imports
export const metadata: Metadata = {
  title: 'MultiQSMP Purgatory',
  description:
    'A website to watch all QSMP Purgatory streamers at the same time.',
};

export function generateStaticParams() {
  return [
    { locale: 'pt' },
    { locale: 'es' },
    { locale: 'en' },
    { locale: 'fr' },
  ];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;

  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CustomGroupsProvider>
        <LayoutMemoryProvider>
          <EasterEggsProvider>{children}</EasterEggsProvider>
        </LayoutMemoryProvider>
      </CustomGroupsProvider>
    </NextIntlClientProvider>
  );
}
