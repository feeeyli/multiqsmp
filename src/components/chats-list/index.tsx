import { useSearchParamsStates } from '@/hooks/useSearchParamsState';
import { Chat } from './chat';

interface ChatsListProps {
  resizing: boolean;
}

export const ChatsList = (props: ChatsListProps) => {
  const { chats } = useSearchParamsStates();

  if (chats.length === 0) return null;

  return (
    <div
      data-resizing={props.resizing}
      className="flex h-full w-full justify-center bg-muted/70 data-[resizing=true]:pointer-events-none"
    >
      {chats.map((chat) => (
        <Chat key={chat} chats={chats} chat={chat} />
      ))}
    </div>
  );
};
