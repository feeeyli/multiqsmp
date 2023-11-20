import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MultiQSMP Purgatory',
  description:
    'A website to watch all QSMP Purgatory streamers at the same time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
