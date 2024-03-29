'use client';

import './globals.css';

// Next Imports

// Contexts Imports
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppVariantProvider } from '@/contexts/app-variant-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';
import { AppVariants } from '@/utils/getAppVariant';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

const GA_ID = 'G-P0V7XD4TFG';

// export const metadata: Metadata = {
//   title: 'MultiQSMP',
//   description: 'A website to watch all QSMP streamers at the same time.',
// };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const titleVariants = {
  qsmp: 'MultiQSMP',
  frogg: 'MultiFrogg',
  purgatory: 'MultiQSMP Purgatory',
};

const descriptionVariants = {
  qsmp: 'A website to watch all QSMP streamers at the same time.',
  frogg: 'A website to watch all Frogg SMP streamers at the same time.',
  purgatory: 'A website to watch all QSMP Purgatory streamers at the same time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getAppVariant = () => {
    if (/^\/purgatory/g.test(pathname)) return 'purgatory';

    return (process.env.NEXT_PUBLIC_APP_VARIANT as AppVariants) ?? 'qsmp';
  };

  const variant = getAppVariant();

  return (
    <html suppressHydrationWarning>
      <head>
        <title>{titleVariants[variant]}</title>
        <meta
          name="description"
          content={descriptionVariants[variant]}
        />

        <meta property="og:url" content={`https://multi${variant}.vercel.app`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={titleVariants[variant]} />
        <meta
          property="og:description"
          content={descriptionVariants[variant]}
        />
        <meta
          property="og:image"
          content={'https://multiqsmp.vercel.app/api/og/' + variant}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titleVariants[variant]} />
        <meta name="twitter:site" content="feeeyli" />
        <meta
          name="twitter:description"
          content={descriptionVariants[variant]}
        />

        <link
          rel="shortcut icon"
          href={`favicon-${variant}.ico`}
          type="image/x-icon"
        />

        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js? 
					id=${GA_ID}`}
        ></Script>
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());

							gtag('config', '${GA_ID}');
						`,
          }}
        ></Script>
        <meta
          name="google-site-verification"
          content="QQVNDnqV_O0kGHcKhluDoGXKAkDTTP3UcMJzVhoMadQ"
        />
        <meta
          property="og:image"
          content={'https://multiqsmp-beta.vercel.app/api/og/' + variant}
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-7629305009580924"
        ></meta>
      </head>
      <body
        className={cn('min-h-dvh w-full', variant === 'qsmp' ? '' : variant)}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            themes={['dark', 'light']}
            enableSystem
          >
            <SettingsProvider>
              <TooltipProvider>
                <AppVariantProvider variant={variant}>
                  {children}
                </AppVariantProvider>
              </TooltipProvider>
            </SettingsProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
