import './globals.css';

// Next Imports
import type { Metadata } from 'next';

// Contexts Imports
import { ThemeProvider } from '@/components/theme-provider';
import { SettingsProvider } from '@/contexts/settings-context';

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
      <head />
      <body className="min-h-screen w-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={['dark', 'light', 'gray-dark', 'gray-light']}
          enableSystem
        >
          <SettingsProvider>{children}</SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
