import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getStreamersFromGroups } from './getStreamersFromGroups';
import { useCustomGroupsContext } from '@/contexts/custom-groups-context';
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const cleanEmpty = (obj: { [x: string]: string }) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != ''));

export function useSearchParamsState(
  searchParamName: string,
  defaultValue: string,
): readonly [
  searchParamsState: string,
  setSearchParamsState: (newState: string) => void,
] {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const acquiredSearchParam = searchParams.get(searchParamName);
  const searchParamsState = acquiredSearchParam ?? defaultValue;

  const setSearchParamsState = (newState: string) => {
    const next = Object.assign(
      {},
      [...searchParams.entries()].reduce(
        (o, [key, value]) => ({ ...o, [key]: value }),
        {},
      ),
      { [searchParamName]: newState },
    );
    const newParams = new URLSearchParams(cleanEmpty(next));

    router.push(`${pathname}?${newParams.toString().replaceAll('%2F', '/')}`);
  };
  return [searchParamsState, setSearchParamsState];
}

export function useSearchParamsStates() {
  const searchParams = useSearchParams();
  const [customGroups] = useCustomGroupsContext();

  const streamersOnQuery = searchParams.get('streamers')?.split('/') || [];
  const groupsOnQuery = searchParams.get('groups')?.split('/') || [];

  const streamersFromGroups = getStreamersFromGroups(
    groupsOnQuery,
    customGroups,
  );

  const actualStreams = [
    ...new Set([...streamersOnQuery, ...streamersFromGroups]),
  ];

  const actualChats = searchParams.get('chats')?.split('/') || [];

  return { streams: actualStreams, chats: actualChats };
}
