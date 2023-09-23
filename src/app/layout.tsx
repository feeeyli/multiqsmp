import './globals.css';

// Next Imports
import type { Metadata } from 'next';

// Components Imports
import { ThemeProvider } from '@/components/theme-provider';

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
          defaultTheme="default-dark"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
