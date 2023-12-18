'use client';

// Libs Imports
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

// Context Imports
import { StreamPlayerControlsProvider } from './stream-player/stream-player-controls-context';
import { useCustomGroupsContext } from '../../contexts/custom-groups-context';

// Scripts Imports
import { getStreamersFromGroups } from '@/utils/getStreamersFromGroups';
import { useHasMounted } from '@/utils/useHasMounted';

// Components Imports
import { StreamPlayer } from './stream-player';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface StreamsListProps {
  resizing: boolean;
  purgatory: boolean;
}

export const StreamsList = (props: StreamsListProps) => {
  const searchParams = useSearchParams();
  const t = useTranslations('streams-list');
  const [customGroups] = useCustomGroupsContext();
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  const streamersOnQuery = searchParams.get('streamers')?.split('/') || [];
  const groupsOnQuery = searchParams.get('groups')?.split('/') || [];

  const streamersFromGroups = getStreamersFromGroups(
    groupsOnQuery,
    customGroups,
  );

  const mergedStreams = [
    ...new Set([...streamersOnQuery, ...streamersFromGroups]),
  ];

  return (
    <div
      data-resizing={props.resizing}
      className="relative flex h-full max-h-screen flex-1 flex-wrap data-[resizing=true]:pointer-events-none"
    >
      {mergedStreams.map((channel) => (
        <StreamPlayerControlsProvider key={channel}>
          <StreamPlayer channel={channel} />
        </StreamPlayerControlsProvider>
      ))}
      {mergedStreams.length === 0 && (
        <div className="flex flex-col gap-12 absolute left-1/2 top-1/2 w-[85%] max-w-sm -translate-x-1/2 -translate-y-1/2 ">
          <div className="text-center">
            {t('no-streams').split('((button))')[0]}
            <ArrowLeftRight size="1.25rem" className="inline text-primary" />
            {t('no-streams').split('((button))')[1]}
          </div>
          {!props.purgatory && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-cold-purple-200 text-center text-sm [text-wrap:balance]">
                Watch the{' '}
                <Link
                  href="https://twitter.com/QSMPEvents"
                  className="text-[#FFA4CF]"
                  target="_blank"
                >
                  #QSMPPurgatory2{' '}
                </Link>
                here:
              </p>
              <Button
                variant="outline"
                className="purgatory flex h-auto cursor-pointer gap-2 border-primary/10 bg-muted hover:bg-primary/10"
                asChild
              >
                <Link href="/purgatory">
                  <Image
                    src="/icon-purgatory.svg"
                    alt="Logo MultiQSMP Purgatório"
                    width={96}
                    height={72}
                    className="w-6"
                  />
                  MultiQSMP Purgatory
                  {/* <ExternalLink size="1rem" /> */}
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
