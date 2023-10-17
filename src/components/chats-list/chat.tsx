import { FoldHorizontal, UnfoldHorizontal, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchParamsState } from '@/utils/useSearchParamsState';
import { useState } from 'react';

interface ChatProps {
  chats: string[];
  chat: string;
}

export const Chat = (props: ChatProps) => {
  const [_, setChats] = useSearchParamsState('chats', '');
  const [collapsed, setCollapsed] = useState(false);

  function handleRemoveChat(chat: string) {
    setChats(props.chats.filter((c) => c !== chat).join('/'));
  }

  return (
    <div
      className="bg-cold-purple-900 group flex flex-grow flex-col items-center data-[collapsed=true]:flex-grow-0"
      data-collapsed={collapsed}
    >
      <div className="flex w-full items-center justify-between gap-2 px-3 py-1 group-data-[collapsed=true]:h-full group-data-[collapsed=true]:flex-col-reverse group-data-[collapsed=true]:px-1 group-data-[collapsed=true]:py-3">
        <Button
          onClick={() => setCollapsed((old) => !old)}
          variant="ghost"
          className="h-auto p-1.5"
          size="sm"
        >
          {collapsed && <UnfoldHorizontal size="1rem" color="#fff" />}
          {!collapsed && <FoldHorizontal size="1rem" color="#fff" />}
        </Button>
        <span className="group-data-[collapsed=true]:vertical-text text-white">
          {props.chat}
        </span>
        <Button
          onClick={() => handleRemoveChat(props.chat)}
          variant="ghost"
          className="h-auto p-1.5"
          size="sm"
        >
          <X size="1rem" color="#fff" />
        </Button>
      </div>
      {/* <TwitchChat channel={props.chat} className="!w-full !h-full" /> */}
      <iframe
        src={`https://www.twitch.tv/embed/${props.chat}/chat?parent=${window.location.hostname}&darkpopout`}
        className="!h-full !w-full group-data-[collapsed=true]:!sr-only"
      />
    </div>
  );
};
