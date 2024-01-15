// React Imports
import { useEffect, useState } from 'react';

// Types Imports

// Data Imports

// Components Imports
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { Streamer } from './streamer';

// Contexts Import
import { useStreamsSelector } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { useFavoriteListsContext } from '../favorite-lists-context';

// Scripts Imports
import { StreamerType } from '@/@types/data';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { useSettings } from '@/contexts/settings-context';
import { STREAMERS as DATA_STREAMERS } from '@/data/streamers';
import { useQueryData } from '@/hooks/useQueryData';
import { useSepareStreamers } from '@/hooks/useSepareStreamers';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePinnedStreamers } from '../pinned-streamers-context';
import { SearchBar } from './search-bar';
import { SelectStreamersDropdown } from './select-streamers-dropdown';
import { SortStreamers } from './sort-streamers';
import { StreamersList } from './streamers-list';

export type OnlineStreamerType = { twitchName: string; isPlayingQsmp: boolean };

export const StreamersTab = () => {
  const t = useTranslations('streamers-dialog');
  const [
    {
      streamers: { outro },
    },
  ] = useSettings();
  const { selectedStreamers } = useStreamsSelector();
  const { streamers: favoritesList } = useFavoriteListsContext();
  const [search, setSearch] = useState('');
  const [searchedStreamers, setSearchedStreamers] = useState<StreamerType[]>(
    [],
  );
  const [streamersOnQuery] = useQueryData();
  const [pinnedStreamers] = usePinnedStreamers();
  const [STREAMERS, setStreamers] = useState<StreamerType[]>(
    [
      ...pinnedStreamers,
      ...streamersOnQuery.filter(
        (streamer) =>
          ![...DATA_STREAMERS, ...pinnedStreamers].some(
            (str) => str.twitch_name === streamer.twitch_name,
          ),
      ),
      ...DATA_STREAMERS,
    ].map((s) => ({
      ...s,
      is_live: true,
      is_playing_qsmp: true,
    })),
  );
  const notDefaultStreamers = STREAMERS.filter(
    (s) => !DATA_STREAMERS.some((str) => str.twitch_name === s.twitch_name),
  ).map((s) => s.twitch_name);
  const [searchMode, setSearchMode] = useState<'qsmp' | 'twitch'>('qsmp');
  const [gettingData, setGettingData] = useState(false);
  const [separe, renderStreamers] = useSepareStreamers();

  useEffect(() => {
    (async () => {
      setGettingData(true);

      const streamers = Array.from(
        new Set([
          ...pinnedStreamers.map((ps) => ps.twitch_name),
          ...streamersOnQuery
            .map((s) => s.twitch_name)
            .filter(
              (streamer) =>
                !DATA_STREAMERS.some((str) => str.twitch_name === streamer),
            ),
          ...DATA_STREAMERS.map((s) => s.twitch_name),
        ]),
      );

      const response = await fetch(
        '/api/streamers?query=' + streamers.join('/').toLocaleLowerCase(),
        { cache: 'no-cache', next: { revalidate: 30 } },
      );

      const data: StreamerType[] = await response.json();

      setStreamers(data);
      setGettingData(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMode]);

  const streamersWithHide = STREAMERS.filter((streamer) => {
    if (
      selectedStreamers.value.some(
        (selected) => selected.twitch_name === streamer.twitch_name,
      )
    )
      return true;

    if (
      (outro.hideOffline && !streamer.is_live) ||
      (outro.hideNotPlaying &&
        !streamer.is_playing_qsmp &&
        !notDefaultStreamers.includes(streamer.twitch_name))
    )
      return false;

    return true;
  }).filter((streamer) => {
    const query = search.toLocaleLowerCase();

    return (
      streamer.display_name.includes(query) ||
      streamer.twitch_name.includes(query)
    );
  });

  function handleTwitchSearch(query: string) {
    if (query.trim() === '') {
      setSearchedStreamers([]);

      return;
    }

    (async () => {
      const response = await fetch(
        '/api/search?query=' + query.toLocaleLowerCase(),
        { cache: 'no-cache', next: { revalidate: 30 } },
      );

      const data: StreamerType[] = await response.json();

      setSearchedStreamers(data);
    })();
  }

  return (
    <TabsContent
      value="streamers"
      className="relative flex h-[90dvh] max-h-96 flex-col gap-3 pb-3 data-[state=inactive]:hidden"
    >
      <header className="flex w-full flex-col items-center gap-3 bg-background sm:flex-col-reverse sm:items-start">
        {searchMode === 'qsmp' && (
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <SelectStreamersDropdown streamersWithHide={streamersWithHide} />
            <SortStreamers />
          </div>
        )}
        <SearchBar
          handleTwitchSearch={handleTwitchSearch}
          handleDefaultSearch={setSearch}
          searchMode={searchMode}
          onSearchModeChange={(mode) => {
            setSearch('');
            setSearchedStreamers([]);
            setSearchMode(mode);
          }}
        />
      </header>
      {gettingData && (
        <div className="flex w-full items-center justify-center gap-3 py-2 text-xs text-muted-foreground">
          <Loader2 size="1rem" className="animate-spin" />
          <span>{t('loading-streamers')}</span>
        </div>
      )}
      <ToggleGroup
        className="scrollbar h-full w-full flex-col space-x-0 overflow-y-auto bg-transparent pt-1"
        type="multiple"
        orientation="vertical"
        value={selectedStreamers.value.map((s) => s.twitch_name)}
        onValueChange={(value) => {
          const mappedValue = value.map((str) => {
            const streamer = [...STREAMERS, ...searchedStreamers].find(
              (s) => s.twitch_name === str,
            );

            if (streamer)
              return {
                display_name: streamer.display_name,
                twitch_name: streamer.twitch_name,
                avatar_url: streamer.avatar_url,
              };

            return {
              display_name: str,
              twitch_name: str,
              avatar_url:
                'https://placehold.co/300x300/1E1A23/FFF.png?text=o_0',
            };
          });

          const mappedSearched = mappedValue
            .filter(
              (s) =>
                !STREAMERS.some((str) => str.twitch_name === s.twitch_name),
            )
            .map(
              (s) =>
                searchedStreamers.find(
                  (ss) => ss.twitch_name === s.twitch_name,
                )!,
            );

          setStreamers((old) => [...mappedSearched, ...old]);

          selectedStreamers.set(mappedValue);
        }}
      >
        {searchMode === 'qsmp' &&
          renderStreamers(
            separe(streamersWithHide),
            <Separator className="my-3" />,
            (streamers, type) => {
              if (streamers.length === 0) return null;

              if (type === 'new')
                return (
                  <StreamersList
                    streamers={streamers.map((s) => ({
                      favorite: favoritesList.value.includes(s.twitch_name),
                      ...s,
                    }))}
                    notSort
                    title="new-participants"
                  />
                );

              if (type === 'favorite')
                return (
                  <StreamersList
                    streamers={streamers.map((s) => ({
                      favorite: true,
                      ...s,
                    }))}
                    notSort
                  />
                );
              if (type === 'non-default' || type === 'default') {
                return <StreamersList streamers={streamers} />;
              }
            },
          )}
        {/* {searchMode === 'qsmp' && (
          <>
            <div className="flex w-full flex-wrap justify-center gap-4">
              {newParticipantsStreamers.length > 0 && (
                <div className="flex w-full flex-col items-center gap-4">
                  <span className="font-bold text-primary">
                    {t(
                      newParticipantsStreamers.length === 1
                        ? 'new-participant'
                        : 'new-participants',
                    )}
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {newParticipantsStreamers.map((streamer) => (
                      <Streamer
                        key={streamer.twitch_name}
                        streamer={streamer}
                        favorite={favoritesList.value.includes(
                          streamer.twitch_name,
                        )}
                        type="qsmp"
                      />
                    ))}
                  </div>
                  <Separator className="my-3" />
                </div>
              )}
              {favoriteStreamers.map((streamer) => (
                <Streamer
                  key={streamer.twitch_name}
                  streamer={streamer}
                  favorite
                  type="qsmp"
                />
              ))}
            </div>
            {favoriteStreamers.length > 0 && notDefaultStreamers.length > 0 && (
              <Separator className="my-3" />
            )}
            {notDefaultStreamers.length > 0 && (
              <StreamersList
                streamers={nonFavoriteStreamers.filter((s) =>
                  notDefaultStreamers.includes(s.twitch_name),
                )}
                notDefaultStreamers={notDefaultStreamers}
              />
            )}
            {(notDefaultStreamers.length > 0 || favoriteStreamers.length > 0) &&
              nonFavoriteStreamers.length > 0 && <Separator className="my-3" />}
            {nonFavoriteStreamers.length > 0 && (
              <StreamersList
                streamers={nonFavoriteStreamers.filter(
                  (s) => !notDefaultStreamers.includes(s.twitch_name),
                )}
                notDefaultStreamers={notDefaultStreamers}
              />
            )}
          </>
        )} */}
        {searchMode === 'twitch' && (
          <>
            {searchedStreamers.length > 0 && (
              <div className="flex w-full flex-wrap justify-center gap-4">
                {searchedStreamers.map((streamer) => (
                  <Streamer
                    key={streamer.twitch_name}
                    streamer={streamer}
                    type="search"
                  />
                ))}
              </div>
            )}
            {searchedStreamers.length === 0 && (
              <div className="flex h-full w-full flex-col items-center justify-center text-sm">
                <span>{t('search-streamers')}</span>
              </div>
            )}
          </>
        )}
      </ToggleGroup>
    </TabsContent>
  );
};
