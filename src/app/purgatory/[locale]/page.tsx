import Page from '../../[locale]/streams';

interface PageProps {
  params: { locale: string };
}

export default function Streams({ params: { locale } }: PageProps) {
  return <Page purgatory locale={locale} />;
}
