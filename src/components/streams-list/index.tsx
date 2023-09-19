'use client';

// Libs Imports
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

// Context Imports
import { StreamPlayerControlsProvider } from './stream-player/stream-player-controls-context';

// Scripts Imports
import { getStreamersFromGroups } from '@/utils/getStreamersFromGroups';

// Components Imports
import { StreamPlayer } from './stream-player';

export const StreamsList = () => {
  const searchParams = useSearchParams();
  const t = useTranslations('streams-list');

  const streamersOnQuery = searchParams.get('streamers')?.split('/') || [];
  const groupsOnQuery = searchParams.get('groups')?.split('/') || [];

  const streamersFromGroups = getStreamersFromGroups(groupsOnQuery);

  const mergedStreams = [
    ...new Set([...streamersOnQuery, ...streamersFromGroups]),
  ];

  return (
    <div className="flex h-full max-h-screen flex-1 flex-wrap">
      {mergedStreams.map((channel) => (
        <StreamPlayerControlsProvider key={channel}>
          <StreamPlayer channel={channel} />
        </StreamPlayerControlsProvider>
      ))}
      {mergedStreams.length === 0 && (
        <div className="absolute left-1/2 top-1/2 w-[85%] max-w-sm -translate-x-1/2 -translate-y-1/2 text-center">
          {t('no-streams')}
        </div>
      )}
    </div>
  );
};
