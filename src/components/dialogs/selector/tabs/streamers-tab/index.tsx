import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { Streamer } from './streamer';

import { useStreamsSelector } from '@/components/dialogs/selector/selector-dialog-context';
import { useFavoriteListsContext } from '../favorite-lists-context';

import { ToggleGroup } from '@/components/ui/toggle-group';
import { useStreamersSearch } from '@/hooks/selector-dialog/useStreamersSearch';
import { useSepareStreamers } from '@/hooks/useSepareStreamers';
import { useTranslations } from '@/hooks/useTranslations';
import { Loading } from './loading';
import { SearchBar } from './search-bar';
import { SelectStreamersDropdown } from './select-streamers-dropdown';
import { SortStreamers } from './sort-streamers';
import { StreamersList } from './streamers-list';

export type OnlineStreamerType = { twitchName: string; isPlayingQsmp: boolean };

export const StreamersTab = () => {
  const t = useTranslations('streamers-dialog');
  const { selectedStreamers } = useStreamsSelector();
  const { streamers: favoritesList } = useFavoriteListsContext();
  const [separe, renderStreamers] = useSepareStreamers();
  const {
    DefaultSearchStreamers,
    TwitchSearchStreamers,
    searchMode,
    isLoading,
    ...restSearch
  } = useStreamersSearch();

  return (
    <TabsContent
      value="streamers"
      className="relative flex h-[90dvh] max-h-96 flex-col gap-3 pb-3 data-[state=inactive]:hidden"
    >
      <header className="flex w-full flex-col items-center gap-3 bg-background sm:flex-col-reverse sm:items-start">
        {searchMode === 'qsmp' && (
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <SelectStreamersDropdown
              streamersWithHide={DefaultSearchStreamers}
            />
            <SortStreamers />
          </div>
        )}
        <SearchBar searchMode={searchMode} {...restSearch} />
      </header>
      {searchMode === 'qsmp' && isLoading && (
        <Loading searchMode={searchMode} />
      )}
      <ToggleGroup
        className="scrollbar h-full w-full flex-col space-x-0 overflow-y-auto bg-transparent pt-1"
        type="multiple"
        orientation="vertical"
        value={selectedStreamers.value.map((s) => s.twitch_name)}
        onValueChange={(value) => {
          const mappedValue = value.map((str) => {
            const streamer = [
              ...DefaultSearchStreamers,
              ...TwitchSearchStreamers,
            ].find((s) => s.twitch_name === str);

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
                'https://placehold.co/300x300/1E1A23/FFF.png?text=o_O',
            };
          });

          selectedStreamers.set(mappedValue);
        }}
      >
        {searchMode === 'qsmp' &&
          renderStreamers(
            separe(DefaultSearchStreamers),
            (i) => <Separator className="my-3" key={i} />,
            (streamers, type) => {
              if (streamers.length === 0) return null;

              if (type === 'new')
                return (
                  <StreamersList
                    streamers={streamers.map((s) => ({
                      favorite: favoritesList.value.includes(s.twitch_name),
                      ...s,
                    }))}
                    key="new-participants"
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
                    key="favorite-streamers"
                    notSort
                  />
                );
              if (type === 'non-default' || type === 'default') {
                return (
                  <StreamersList
                    streamers={streamers}
                    key={type + '-streamers'}
                  />
                );
              }
            },
          )}
        {searchMode === 'twitch' && (
          <>
            {TwitchSearchStreamers.length > 0 && (
              <div className="flex w-full flex-wrap justify-center gap-4">
                {TwitchSearchStreamers.map((streamer) => (
                  <Streamer
                    key={streamer.twitch_name}
                    streamer={streamer}
                    type="search"
                  />
                ))}
              </div>
            )}
            {TwitchSearchStreamers.length === 0 && (
              <div className="flex h-full w-full flex-col items-center justify-center text-sm">
                {isLoading && <Loading searchMode={searchMode} />}
                {!isLoading && <span>{t('search-streamers')}</span>}
              </div>
            )}
          </>
        )}
      </ToggleGroup>
    </TabsContent>
  );
};
