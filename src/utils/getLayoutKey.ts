import { ReadonlyURLSearchParams } from 'next/navigation';

function sort(arr: string[] | undefined) {
  if (typeof arr === 'undefined') return undefined;

  return arr.sort((a, b) => a.localeCompare(b));
}

export function getLayoutKey(
  searchParams: ReadonlyURLSearchParams,
  { movableChat }: { movableChat: boolean },
) {
  const streamers = sort(searchParams.get('streamers')?.split('/'));
  const groups = sort(searchParams.get('groups')?.split('/'));
  const chats = sort(searchParams.get('chats')?.split('/'));

  return `${streamers?.join('/') || ''}${streamers && groups ? '/' : ''}${
    groups?.join('/') || ''
  }${chats && (groups || streamers) ? '/' : ''}${
    chats && movableChat ? `$${chats?.join('$')}` : chats ? '$chats$' : ''
  }`;
}
