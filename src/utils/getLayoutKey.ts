import { ReadonlyURLSearchParams } from 'next/navigation';

export function getLayoutKey(
  searchParams: ReadonlyURLSearchParams,
  { movableChat }: { movableChat: boolean },
) {
  const streamers = searchParams.get('streamers')?.split('/');
  const groups = searchParams.get('groups')?.split('/');
  const chats = searchParams.get('chats')?.split('/');

  return `${streamers?.join('/') || ''}${streamers && groups ? '/' : ''}${
    groups?.join('/') || ''
  }${chats && (groups || streamers) ? '/' : ''}${
    chats && movableChat ? `$${chats?.join('$')}` : chats ? '$chats$' : ''
  }`;
}
