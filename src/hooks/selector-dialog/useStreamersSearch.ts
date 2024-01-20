import { StreamerType } from '@/@types/data';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { matchSorter } from 'match-sorter';
import { ChangeEvent, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { useQueryStreamers } from './useQueryStreamers';
import { useStreamersFormat } from './useStreamersFormat';

export function useStreamersSearch() {
  const [searchMode, setSearchMode] = useState<'qsmp' | 'twitch'>('qsmp');
  const toggleSearchMode = () =>
    setSearchMode((old) => (old === 'qsmp' ? 'twitch' : 'qsmp'));

  const [search, updateSearch] = useState('');
  const trimmedSearch = useDebounce(search, 500).trim();

  const setSearch = (e: ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === 'string') return updateSearch(e);

    updateSearch(e.target.value);
  };

  const { data: TwitchSearchStreamers, isLoading: isLoadingTwitchSearch } =
    useQuery({
      queryKey: ['streamer-search'].concat(
        trimmedSearch !== '' ? trimmedSearch : [],
      ),
      queryFn: async () => {
        if (trimmedSearch === '') return [];

        const { data } = await axios.get<StreamerType[]>('/api/search', {
          params: {
            query: trimmedSearch.toLocaleLowerCase(),
          },
        });
        return data;
      },
    });

  const { Streamers, isLoading: isLoadingDefaultStreamers } =
    useQueryStreamers();

  const streamersWithHide = useStreamersFormat(Streamers);

  const isLoading = isLoadingTwitchSearch || isLoadingDefaultStreamers;

  const DefaultSearchStreamers = matchSorter(streamersWithHide, search, {
    keys: ['twitch_name', 'display_name'],
    baseSort: () => 0,
  });

  return {
    search,
    setSearch,
    searchMode,
    toggleSearchMode,
    TwitchSearchStreamers: TwitchSearchStreamers ?? [],
    DefaultSearchStreamers,
    isLoading,
  };
}
