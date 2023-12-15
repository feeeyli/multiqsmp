import Page from './streams';

interface PageProps {
  params: { locale: string };
}

export default function Streams({ params: { locale } }: PageProps) {
  return <Page purgatory={false} locale={locale}/>;
}
