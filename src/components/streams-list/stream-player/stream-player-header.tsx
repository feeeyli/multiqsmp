// React Imports
import { useContext, useState } from 'react';

// Next Imports
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Icons Imports
import {
  ChevronLeft,
  Maximize,
  MessageSquare,
  MessageSquareDashed,
  Minimize,
  RefreshCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';

// Contexts Imports
import { StreamPlayerControlsContext } from './stream-player-controls-context';

// Components Imports
import { Button } from '@/components/ui/button';

interface StreamPlayerHeaderProps {
  channel: string;
}

export const StreamPlayerHeader = (props: StreamPlayerHeaderProps) => {
  const [opened, setOpened] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const streamPlayerControls = useContext(StreamPlayerControlsContext);
  const searchParams = useSearchParams();

  const activesChats = searchParams.get('chats')?.split('/') || [];
  const isChatActive = activesChats.includes(props.channel);

  function getChatUrl() {
    const newSearchParams = new URLSearchParams(window.location.search);

    if (!isChatActive) {
      newSearchParams.set('chats', [...activesChats, props.channel].join('/'));
    } else {
      const newActivesChats = activesChats.filter(
        (chat) => chat !== props.channel,
      );

      newActivesChats.length === 0
        ? newSearchParams.delete('chats')
        : newSearchParams.set('chats', newActivesChats.join('/'));
    }

    return ('?' + newSearchParams).replaceAll('%2F', '/');
  }

  return (
    <header
      data-opened={opened}
      className="group/header absolute left-1 top-1 flex w-8 items-center overflow-hidden rounded-md bg-card/30 transition-all data-[opened=true]:w-[calc(5*2rem)]"
    >
      <Button
        variant="stream-header"
        size="stream-header"
        onClick={() => setOpened((old) => !old)}
      >
        <ChevronLeft
          size="1rem"
          className="text-foreground transition-all group-data-[opened=true]/header:rotate-180"
        />
      </Button>
      <div className="h-7">
        <Button
          tabIndex={opened ? 0 : -1}
          onClick={() => streamPlayerControls.muted.set((old) => !old)}
          variant="stream-header"
          size="stream-header"
        >
          {streamPlayerControls.muted.value && (
            <VolumeX size="1rem" className="text-foreground" />
          )}
          {!streamPlayerControls.muted.value && (
            <Volume2 size="1rem" className="text-foreground" />
          )}
        </Button>
        <Button
          tabIndex={opened ? 0 : -1}
          onClick={() => streamPlayerControls.fullScreen.set((old) => !old)}
          variant="stream-header"
          size="stream-header"
        >
          {streamPlayerControls.fullScreen.value && (
            <Minimize size="1rem" className="text-foreground" />
          )}
          {!streamPlayerControls.fullScreen.value && (
            <Maximize size="1rem" className="text-foreground" />
          )}
        </Button>
        <Button
          tabIndex={opened ? 0 : -1}
          // onClick={() => router.replace(pathname + )}
          variant="stream-header"
          size="stream-header"
          asChild
        >
          <Link href={getChatUrl()}>
            {isChatActive && (
              <MessageSquare size="1rem" className="text-foreground" />
            )}
            {!isChatActive && (
              <MessageSquareDashed size="1rem" className="text-foreground" />
            )}
          </Link>
        </Button>
        {/*  
        {!isYoutubeStream && (
          <button
            onClick={() => {
              if (isDesktop && chatList.length >= 4 && !channelSelected) return

              if (!isDesktop && chatList.length >= 2 && !channelSelected) return

              const newChatList = toggleChat(channel)

              const newSearchParams = new URLSearchParams(
                window.location.search,
              )

              if (newChatList.length === 0) {
                newSearchParams.delete('chats')
              } else if (newSearchParams.get('chats')) {
                newSearchParams.set('chats', newChatList.join('/'))
              } else {
                newSearchParams.append('chats', newChatList.join('/'))
              }

              router.replace(
                pathname +
                  '?' +
                  newSearchParams.toString().replaceAll('%2F', '/'),
              )

              // chatLinkRef.current!.href =
              // 	`?${newSearchParams}`;
              // chatLinkRef.current!.click();
            }}
            tabIndex={headerMenuOpened ? 0 : -1}
            className="inline-block h-full px-2 py-1 hover:bg-[#302a3963]"
          >
            <ChatBubbleIcon
              color="#fff"
              data-opened={channelSelected}
              className="h-4 w-4 opacity-50 data-[opened=true]:opacity-100"
            />
          </button>
        )} */}
        <Button
          onClick={() => {
            if (refreshing) return;

            streamPlayerControls.refresh.run();

            setRefreshing(true);

            setTimeout(() => {
              setRefreshing(false);
            }, 400);
          }}
          tabIndex={opened ? 0 : -1}
          size="stream-header"
          variant="stream-header"
        >
          <RefreshCcw
            color="#fff"
            data-refreshing={refreshing}
            className="h-4 w-4 data-[refreshing=true]:animate-wow"
          />
        </Button>
      </div>
    </header>
  );
};
