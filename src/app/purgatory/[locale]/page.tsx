import { Metadata } from 'next';
import Page from '../../[locale]/streams';

export const metadata: Metadata = {
  title: 'MultiQSMP Purgatory',
  description:
    'A website to watch all QSMP Purgatory streamers at the same time.',
};

export default function Purgatory() {
  return <Page purgatory />;
}
