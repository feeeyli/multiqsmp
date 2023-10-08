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

interface StreamsListProps {
  resizing: boolean;
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
      className="flex h-full max-h-screen flex-1 flex-wrap data-[resizing=true]:pointer-events-none"
    >
      {mergedStreams.map((channel) => (
        <StreamPlayerControlsProvider key={channel}>
          <StreamPlayer channel={channel} />
        </StreamPlayerControlsProvider>
      ))}
      {mergedStreams.length === 0 && (
        <div className="absolute left-1/2 top-1/2 w-[85%] max-w-sm -translate-x-1/2 -translate-y-1/2 text-center">
          {t('no-streams').split('((button))')[0]}
          <ArrowLeftRight size="1.25rem" className="inline text-primary" />
          {t('no-streams').split('((button))')[1]}
        </div>
      )}
    </div>
  );
};
