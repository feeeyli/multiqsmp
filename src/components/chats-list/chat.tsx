import { useSettingsContext } from '@/contexts/settings-context';
import { getDisplayName } from '@/utils/getDisplayName';
import { useSearchParamsState } from '@/utils/useSearchParamsState';
import { FoldHorizontal, UnfoldHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface ChatProps {
  chats?: string[];
  isMoving?: boolean;
  chat: string;
}

const DEBUG_MODE =
  typeof localStorage === 'undefined'
    ? false
    : localStorage.getItem('DEBUG_MODE') === 'true'
    ? true
    : false;

export const Chat = (props: ChatProps) => {
  const [chatsString, setChats] = useSearchParamsState('chats', '');
  const chats = chatsString.split('/');
  const [collapsed, setCollapsed] = useState(false);
  const [
    {
      streams: { movableChat },
    },
  ] = useSettingsContext();

  function handleRemoveChat(chat: string) {
    setChats(chats.filter((c) => c !== chat).join('/'));
  }

  if (movableChat)
    return (
      <>
        <div className="handle flex h-7 w-full cursor-move items-center justify-between gap-2 pl-3 text-sm group-data-[collapsed=true]:h-full group-data-[collapsed=true]:flex-col group-data-[collapsed=true]:px-1 group-data-[collapsed=true]:py-3">
          {getDisplayName(props.chat)}
          <Button
            onClick={() => handleRemoveChat(props.chat)}
            variant="ghost"
            className="h-7 w-8 cursor-pointer px-0 hover:bg-primary/20"
            size="sm"
          >
            <X size="1rem" className="text-foreground" />
          </Button>
        </div>
        <div className="bg-cold-purple-900 group flex flex-grow flex-col items-center overflow-hidden data-[collapsed=true]:flex-grow-0">
          {!DEBUG_MODE && (
            <iframe
              src={`https://www.twitch.tv/embed/${props.chat}/chat?parent=${window.location.hostname}&darkpopout`}
              className="!h-full !w-full data-[collapsed=true]:!sr-only data-[is-moving=true]:pointer-events-none"
              data-collapsed={collapsed}
              data-is-moving={props.isMoving}
            />
          )}
          {DEBUG_MODE && <span>Chat de {props.chat}</span>}
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
      {!DEBUG_MODE && (
        <iframe
          src={`https://www.twitch.tv/embed/${props.chat}/chat?parent=${window.location.hostname}&darkpopout`}
          className="!h-full !w-full group-data-[collapsed=true]:!sr-only"
        />
      )}
      {DEBUG_MODE && <span>Chat de {props.chat}</span>}
    </div>
  );
};
