// React Imports
import { ReactNode, useContext, useState } from 'react';

// Next Imports
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Icons Imports
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Maximize,
  MessageSquare,
  MessageSquareDashed,
  Minimize,
  RefreshCcw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

// Contexts Imports
import { StreamPlayerControlsContext } from './stream-player-controls-context';

// Components Imports
import { Button } from '@/components/ui/button';
import { useSettingsContext } from '@/contexts/settings-context';
import {
  useSearchParamsState,
  useSearchParamsStates,
} from '@/utils/useSearchParamsState';
import { motion } from 'framer-motion';

interface StreamPlayerHeaderProps {
  channel: string;
  isYoutubeStream: boolean;
}

export const StreamPlayerHeader = (props: StreamPlayerHeaderProps) => {
  const [opened, setOpened] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const streamPlayerControls = useContext(StreamPlayerControlsContext);
  const searchParams = useSearchParams();
  const [
    {
      streams: { alwaysShowHeader, headerItems },
    },
  ] = useSettingsContext();

  const [chats, setChats] = useSearchParamsState('chats', '');
  const [streams, setStreams] = useSearchParamsState('streamers', '');
  const isChatActive = chats.includes(props.channel);

  function handleToggleChat() {
    const chatsArray = chats === '' ? [] : chats.split('/');

    if (!isChatActive) {
      setChats([...chatsArray, props.channel].join('/'));
    } else {
      setChats(chatsArray.filter((chat) => chat !== props.channel).join('/'));
    }
  }

  function handleRemove() {
    const streamsArray = streams === '' ? [] : streams.split('/');

    setStreams(
      streamsArray.filter((stream) => stream !== props.channel).join('/'),
    );
  }

  function handleMove(dir: 'up' | 'down') {
    let newActivesStreams = streams === '' ? [] : streams.split('/');

    const index = newActivesStreams.findIndex((s) => s === props.channel);

    if (
      (index <= 0 && dir === 'down') ||
      (index >= newActivesStreams.length - 1 && dir === 'up')
    )
      return;

    if (dir === 'down') {
      const itemOnIndex = newActivesStreams[index];

      const itemBefore = newActivesStreams[index - 1];

      newActivesStreams[index] = itemBefore;

      newActivesStreams[index - 1] = itemOnIndex;
    }

    if (dir === 'up') {
      const itemOnIndex = newActivesStreams[index];

      const itemAfter = newActivesStreams[index + 1];

      newActivesStreams[index] = itemAfter;

      newActivesStreams[index + 1] = itemOnIndex;
    }

    setStreams(newActivesStreams.join('/'));
  }

  const headerActions: { [name: string]: ReactNode } = {
    mute: (
      <Button
        tabIndex={opened ? 0 : -1}
        onClick={() => streamPlayerControls.muted.set((old) => !old)}
        variant="stream-header"
        size="stream-header"
        key="mute"
      >
        {streamPlayerControls.muted.value && (
          <VolumeX size="1rem" className="text-foreground" />
        )}
        {!streamPlayerControls.muted.value && (
          <Volume2 size="1rem" className="text-foreground" />
        )}
      </Button>
    ),
    fullscreen: (
      <Button
        tabIndex={opened ? 0 : -1}
        onClick={() => streamPlayerControls.fullScreen.set((old) => !old)}
        variant="stream-header"
        size="stream-header"
        key="fullscreen"
      >
        {streamPlayerControls.fullScreen.value && (
          <Minimize size="1rem" className="text-foreground" />
        )}
        {!streamPlayerControls.fullScreen.value && (
          <Maximize size="1rem" className="text-foreground" />
        )}
      </Button>
    ),
    chat: (
      <Button
        tabIndex={opened ? 0 : -1}
        onClick={() => handleToggleChat()}
        variant="stream-header"
        size="stream-header"
        data-disabled={props.isYoutubeStream}
        className="data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
        key="chat"
      >
        {isChatActive && (
          <MessageSquare size="1rem" className="text-foreground" />
        )}
        {!isChatActive && (
          <MessageSquareDashed size="1rem" className="text-foreground" />
        )}
      </Button>
    ),
    reload: (
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
        key="reload"
      >
        <RefreshCcw
          data-refreshing={refreshing}
          className="h-4 w-4 text-foreground data-[refreshing=true]:animate-wow"
        />
      </Button>
    ),
    'remove-stream': (
      <Button
        onClick={() => handleRemove()}
        tabIndex={opened ? 0 : -1}
        variant="stream-header"
        size="stream-header"
        key="remove-stream"
      >
        <X size="1rem" className="text-foreground" />
      </Button>
    ),
    'move-left': (
      <Button
        onClick={() => handleMove('down')}
        tabIndex={opened ? 0 : -1}
        variant="stream-header"
        size="stream-header"
        key="move-left"
      >
        <ChevronsLeft size="1rem" className="text-foreground" />
      </Button>
    ),
    'move-right': (
      <Button
        onClick={() => handleMove('up')}
        tabIndex={opened ? 0 : -1}
        variant="stream-header"
        size="stream-header"
        key="move-right"
      >
        <ChevronsRight size="1rem" className="text-foreground" />
      </Button>
    ),
  };

  const headerItemsSorted = (
    [
      'mute',
      'fullscreen',
      'chat',
      'reload',
      'remove-stream',
      'move-left',
      'move-right',
    ] as typeof headerItems
  ).filter((i) => (headerItems || []).includes(i));

  const style = {
    '--items': headerItemsSorted.length + (alwaysShowHeader ? 0 : 1),
  } as React.CSSProperties;

  // const y = useTransform(x, [0, 1], [0, 2])

  const headerVariants = {
    opened: {
      width: 'auto',
    },
    closed: {
      width: '2rem',
    },
  };

  return (
    <motion.header
      data-opened={alwaysShowHeader || opened}
      data-always-show-header={alwaysShowHeader}
      style={style}
      animate={alwaysShowHeader || opened ? 'opened' : 'closed'}
      variants={headerVariants}
      transition={{ width: { type: 'spring', bounce: 0.2, duration: 0.5 } }}
      className="group/header gray-dark absolute left-1 top-1 flex items-center overflow-hidden rounded-md bg-card/30"
    >
      {!alwaysShowHeader && (
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
      )}
      <div className="h-7">
        {headerItemsSorted.map((item) => headerActions[item])}
      </div>
    </motion.header>
  );
};
