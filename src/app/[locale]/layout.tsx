// Next Imports
import { notFound } from 'next/navigation';

// Libs Imports
import { CustomGroupsProvider } from '@/contexts/custom-groups-context';
import { EasterEggsProvider } from '@/contexts/easter-eggs-context';
import { LayoutProvider } from '@/contexts/layout-memory-context';
import { SwapStreamsProvider } from '@/contexts/swap-points-context';
import { NextIntlClientProvider } from 'next-intl';

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
        <LayoutProvider>
          <SwapStreamsProvider>
            <EasterEggsProvider>{children}</EasterEggsProvider>
          </SwapStreamsProvider>
        </LayoutProvider>
      </CustomGroupsProvider>
    </NextIntlClientProvider>
  );
}
