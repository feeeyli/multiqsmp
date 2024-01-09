import './globals.css';

// Next Imports
import type { Metadata } from 'next';

// Contexts Imports
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SettingsProvider } from '@/contexts/settings-context';
import Script from 'next/script';

const GA_ID = 'G-P0V7XD4TFG';

export const metadata: Metadata = {
  title: 'MultiQSMP',
  description: 'A website to watch all QSMP streamers at the same time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta
          name="description"
          content="A website to watch all QSMP streamers at the same time."
        />

        <meta property="og:url" content="https://multiqsmp.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MultiQSMP" />
        <meta
          property="og:description"
          content="A website to watch all QSMP streamers at the same time."
        />
        <meta
          property="og:image"
          content="https://multiqsmp.vercel.app/api/og"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MultiQSMP" />
        <meta name="twitter:site" content="@feeeyli" />
        <meta
          name="twitter:description"
          content="A website to watch all QSMP streamers at the same time."
        />
        <meta
          name="twitter:image"
          content="https://multiqsmp.vercel.app/api/og"
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
          content="https://multiqsmp-beta.vercel.app/api/og"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-7629305009580924"
        ></meta>
      </head>
      <body className="min-h-dvh w-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={[
            'dark',
            'light',
            'gray-dark',
            'gray-light',
            'regret',
            'code',
            'purgatory',
          ]}
          enableSystem
        >
          <SettingsProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
