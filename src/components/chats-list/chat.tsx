import { FoldHorizontal, UnfoldHorizontal, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchParamsState } from '@/utils/useSearchParamsState';
import { useState } from 'react';
import { useSettingsContext } from '@/contexts/settings-context';

interface ChatProps {
  chats?: string[];
  isMoving?: boolean;
  chat: string;
}

export const Chat = (props: ChatProps) => {
  const [chatsString, setChats] = useSearchParamsState('chats', '');
  const chats = chatsString.split('/');
  const [collapsed, setCollapsed] = useState(false);
  const [
    {
      streams: { movableChat, movableMode },
    },
  ] = useSettingsContext();

  function handleRemoveChat(chat: string) {
    setChats(chats.filter((c) => c !== chat).join('/'));
  }

  if (movableChat && movableMode)
    return (
      <>
        <div className="handle flex h-3 w-full cursor-move items-center justify-between gap-2 px-3 group-data-[collapsed=true]:h-full group-data-[collapsed=true]:flex-col group-data-[collapsed=true]:px-1 group-data-[collapsed=true]:py-3">
          {/* <Button
          onClick={() => setCollapsed((old) => !old)}
          variant="ghost"
          className="h-auto p-1.5"
          size="sm"
        >
          {collapsed && (
            <UnfoldHorizontal size="1rem" className="text-foreground" />
          )}
          {!collapsed && (
            <FoldHorizontal size="1rem" className="text-foreground" />
          )}
        </Button>
        <span className="group-data-[collapsed=true]:vertical-text text-foreground">
          {props.chat}
        </span>
        <Button
          onClick={() => handleRemoveChat(props.chat)}
          variant="ghost"
          className="z-10 h-auto p-1.5 hover:bg-muted"
          size="sm"
        >
          <X size="1rem" className="text-foreground" />
        </Button> */}
        </div>
        <div
          className="bg-cold-purple-900 group flex flex-grow flex-col items-center overflow-hidden data-[collapsed=true]:flex-grow-0"
          // data-collapsed={collapsed}
        >
          {/* <TwitchChat channel={props.chat} className="!w-full !h-full" /> */}
          <iframe
            src={`https://www.twitch.tv/embed/${props.chat}/chat?parent=${window.location.hostname}&darkpopout`}
            className="!h-full !w-full data-[collapsed=true]:!sr-only data-[is-moving=true]:pointer-events-none"
            data-collapsed={collapsed}
            data-is-moving={props.isMoving}
          />
        </div>
      </>
    );

  return (
    <div
      className="bg-cold-purple-900 group flex flex-grow flex-col items-center data-[collapsed=true]:flex-grow-0"
      data-collapsed={collapsed}
    >
      <div className="flex w-full items-center justify-between gap-2 px-3 py-1 group-data-[collapsed=true]:h-full group-data-[collapsed=true]:flex-col group-data-[collapsed=true]:px-1 group-data-[collapsed=true]:py-3">
        <Button
          onClick={() => setCollapsed((old) => !old)}
          variant="ghost"
          className="h-auto p-1.5"
          size="sm"
        >
          {collapsed && (
            <UnfoldHorizontal size="1rem" className="text-foreground" />
          )}
          {!collapsed && (
            <FoldHorizontal size="1rem" className="text-foreground" />
          )}
        </Button>
        <span className="group-data-[collapsed=true]:vertical-text text-foreground">
          {props.chat}
        </span>
        <Button
          onClick={() => handleRemoveChat(props.chat)}
          variant="ghost"
          className="h-auto p-1.5"
          size="sm"
        >
          <X size="1rem" className="text-foreground" />
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
