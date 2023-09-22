// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { getStreamersFromGroups } from './getStreamersFromGroups';
import { useCustomGroupsContext } from '@/components/contexts/custom-groups-context';

// type valuesProps = {
//   streamers?: string[];
//   groups?: string[];
//   chats?: string[];
// };

// type useSearchParamsStatesReturn = [
//   valuesProps,
//   (newValues: valuesProps) => string,
//   string,
// ];

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
// export function useSearchParamsStates(): useSearchParamsStatesReturn {
//   const nextSearchParams = useSearchParams();
//   const searchParams = new URLSearchParams(window.location.search);

//   // if (!isChatActive) {
//   //   newSearchParams.set('chats', [...activesChats, props.channel].join('/'));
//   // } else {
//   //   const newActivesChats = activesChats.filter(
//   //     (chat) => chat !== props.channel,
//   //   );

//   //   newActivesChats.length === 0
//   //     ? newSearchParams.delete('chats')
//   //     : newSearchParams.set('chats', newActivesChats.join('/'));
//   // }

//   // return ('?' + newSearchParams).replaceAll('%2F', '/');

//   const [params, setParams] = useState('');

//   function setValues(newValues: valuesProps) {
//     const streamers =
//       newValues.streamers?.join('/') || searchParams.get('streamers');
//     const groups = newValues.groups?.join('/') || searchParams.get('groups');
//     const chats = newValues.chats?.join('/') || searchParams.get('chats');

//     if (streamers) {
//       searchParams.set('streamers', streamers);
//     } else {
//       searchParams.delete('streamers');
//     }

//     if (groups) {
//       searchParams.set('groups', groups);
//     } else {
//       searchParams.delete('groups');
//     }

//     if (chats) {
//       searchParams.set('chats', chats);
//     } else {
//       searchParams.delete('chats');
//     }

//     const url = ('?' + searchParams).replaceAll('%2F', '/');

//     setParams(url);

//     return url;
//   }

//   useEffect(() => {
//     setParams(('?' + nextSearchParams).replaceAll('%2F', '/'));
//   }, [nextSearchParams]);

//   const [values] = useState()

//   return [
//     {
//       streamers: searchParams.get('streamers')?.split('/') || [],
//       groups: searchParams.get('groups')?.split('/') || [],
//       chats: searchParams.get('chats')?.split('/') || [],
//     },
//     setValues,
//     params,
//   ];
// }
// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// type valuesProps = {
//   streamers?: string[];
//   groups?: string[];
//   chats?: string[];
// };

// type useSearchParamsStatesReturn = [
//   valuesProps,
//   (newValues: valuesProps) => string,
//   string,
// ];

// export function getSearchParamsStateUrl(
//   setValues: (old: valuesProps) => valuesProps | valuesProps,
// ): string {
//   const searchParams = new URLSearchParams(window.location.search);

//   const values =
//     typeof setValues === 'string'
//       ? setValues
//       : setValues({
//           streamers: searchParams.get('streamers')?.split('/') || [],
//           groups: searchParams.get('groups')?.split('/') || [],
//           chats: searchParams.get('chats')?.split('/') || [],
//         });

//   const streamers =
//     values.streamers?.join('/') !== ''
//       ? values.streamers?.join('/')
//       : searchParams.get('streamers');
//   const groups =
//     values.groups?.join('/') !== ''
//       ? values.groups?.join('/')
//       : searchParams.get('groups');
//   const chats =
//     values.chats?.join('/') !== ''
//       ? values.chats?.join('/')
//       : searchParams.get('chats');

//   if (streamers) {
//     searchParams.set('streamers', streamers);
//   } else {
//     searchParams.delete('streamers');
//   }

//   if (groups) {
//     searchParams.set('groups', groups);
//   } else {
//     searchParams.delete('groups');
//   }

//   if (chats) {
//     searchParams.set('chats', chats);
//   } else {
//     searchParams.delete('chats');
//   }

//   const url = ('?' + searchParams).replaceAll('%2F', '/');

//   return url;
// }
