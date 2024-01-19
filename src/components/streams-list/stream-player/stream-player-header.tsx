// React Imports
import { ReactNode, useContext, useState } from 'react';

// Next Imports

// Icons Imports
import {
  ChevronLeft,
  Expand,
  EyeOff,
  MessageSquare,
  MessageSquareDashed,
  RefreshCcw,
  Shrink,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

// Contexts Imports
import { StreamPlayerControlsContext } from './stream-player-controls-context';

// Components Imports
import {
  AddSwapPoint,
  CaptionsSquare,
  CaptionsSquareDashed,
  GoToSwapPoint,
  RemoveSwapPoint,
} from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useSettings } from '@/contexts/settings-context';
import { useSwapStreams } from '@/contexts/swap-points-context';
import { useSearchParamsState } from '@/hooks/useSearchParamsState';
import { useTranslations } from '@/hooks/useTranslations';
import { motion } from 'framer-motion';

interface StreamPlayerHeaderProps {
  channel: string;
  groupName?: string;
}

export const StreamPlayerHeader = (props: StreamPlayerHeaderProps) => {
  const [opened, setOpened] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { index, ...streamPlayerControls } = useContext(
    StreamPlayerControlsContext,
  );
  const [
    {
      streams: {
        alwaysShowHeader,
        headerItems,
        useHandleAsHeader: useHandleAsHeaderSet,
      },
    },
  ] = useSettings();

  const [chats, setChats] = useSearchParamsState('chats', '');
  const [streams, setStreams] = useSearchParamsState('streamers', '');
  const [groups, setGroups] = useSearchParamsState('groups', '');
  const isChatActive = chats.includes(props.channel);
  const { swap, swapPoints } = useSwapStreams();
  const t = useTranslations('button-titles.stream-player-header');

  function handleToggleChat() {
    const chatsArray = chats === '' ? [] : chats.split('/');

    if (!isChatActive) {
      setChats([...chatsArray, props.channel].join('/'));
    } else {
      setChats(chatsArray.filter((chat) => chat !== props.channel).join('/'));
    }
  }

  function handleRemove() {
    if (props.groupName === undefined) {
      const streamsArray = streams === '' ? [] : streams.split('/');

      setStreams(
        streamsArray.filter((stream) => stream !== props.channel).join('/'),
      );
    } else {
      const groupsArray = groups === '' ? [] : groups.split('/');

      setGroups(
        groupsArray
          .map((g) => {
            if (g.split('.')[0] === props.groupName)
              return `${g}${g.includes('.') ? '' : '.'}-${props.channel}`;

            return g;
          })
          .join('/'),
      );
    }
  }

  const headerActions: { [name: string]: ReactNode } = {
    mute: (
      <Tooltip title={t('mute')} key="mute">
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
      </Tooltip>
    ),
    fullscreen: (
      <Tooltip title={t('fullscreen')} key="fullscreen">
        <Button
          tabIndex={opened ? 0 : -1}
          onClick={() => streamPlayerControls.fullScreen.set((old) => !old)}
          variant="stream-header"
          size="stream-header"
        >
          {streamPlayerControls.fullScreen.value && (
            <Shrink size="1rem" className="text-foreground" />
          )}
          {!streamPlayerControls.fullScreen.value && (
            <Expand size="1rem" className="text-foreground" />
          )}
        </Button>
      </Tooltip>
    ),
    chat: (
      <Tooltip title={t('chat')} key="chat">
        <Button
          tabIndex={opened ? 0 : -1}
          onClick={() => handleToggleChat()}
          variant="stream-header"
          size="stream-header"
          className="data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
        >
          {isChatActive && (
            <MessageSquare size="1rem" className="text-foreground" />
          )}
          {!isChatActive && (
            <MessageSquareDashed size="1rem" className="text-foreground" />
          )}
        </Button>
      </Tooltip>
    ),
    captions: (
      <Tooltip title={t('captions')} key="captions">
        <Button
          tabIndex={opened ? 0 : -1}
          onClick={() => streamPlayerControls.captions.set((old) => !old)}
          variant="stream-header"
          size="stream-header"
        >
          {streamPlayerControls.captions.value && (
            <CaptionsSquare size="1rem" className="text-foreground" />
          )}
          {!streamPlayerControls.captions.value && (
            <CaptionsSquareDashed size="1rem" className="text-foreground" />
          )}
        </Button>
      </Tooltip>
    ),
    reload: (
      <Tooltip title={t('reload')} key="reload">
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
            data-refreshing={refreshing}
            className="h-4 w-4 text-foreground data-[refreshing=true]:animate-wow"
          />
        </Button>
      </Tooltip>
    ),
    'remove-stream': (
      <Tooltip title={t('remove-stream')} key="remove-stream">
        <Button
          onClick={() => handleRemove()}
          tabIndex={opened ? 0 : -1}
          variant="stream-header"
          size="stream-header"
        >
          {props.groupName === undefined && (
            <X size="1rem" className="text-foreground" />
          )}
          {props.groupName !== undefined && (
            <EyeOff size="1rem" className="text-foreground" />
          )}
        </Button>
      </Tooltip>
    ),
    'swap-points': (
      <>
        {!swapPoints.value.includes(index) && (
          <>
            {swapPoints.value.slice(0, 4).map((_, i) => {
              return (
                <Tooltip
                  title={t('goto-swap-point').replace(
                    '((swap-point))',
                    String(i + 1),
                  )}
                  key={i}
                >
                  <Button
                    tabIndex={opened ? 0 : -1}
                    onClick={() => {
                      if (index !== undefined) swap(i, index);
                    }}
                    variant="stream-header"
                    size="stream-header"
                  >
                    <GoToSwapPoint
                      className="text-foreground"
                      size="1rem"
                      variant={i}
                    />
                  </Button>
                </Tooltip>
              );
            })}
            {swapPoints.value.length < 4 && (
              <Tooltip title={t('add-swap-point')} key="add-swap-point">
                <Button
                  tabIndex={opened ? 0 : -1}
                  onClick={() => {
                    swapPoints.set((old) => {
                      if (index !== undefined && old.length < 4)
                        return [...old, index];
                      return old;
                    });
                  }}
                  variant="stream-header"
                  size="stream-header"
                >
                  <AddSwapPoint className="text-foreground" size="1rem" />
                </Button>
              </Tooltip>
            )}
          </>
        )}
        {swapPoints.value.includes(index) && (
          <Tooltip title={t('remove-swap-point')} key="remove-swap-point">
            <Button
              tabIndex={opened ? 0 : -1}
              onClick={() => {
                if (index !== undefined)
                  swapPoints.set((old) => old.filter((sp) => sp !== index));
              }}
              variant="stream-header"
              size="stream-header"
            >
              <RemoveSwapPoint className="text-foreground" size="1rem" />
            </Button>
          </Tooltip>
        )}
      </>
    ),
  };

  const headerItemsSorted = (
    [
      'fullscreen',
      'mute',
      'chat',
      'remove-stream',
      'reload',
      'swap-points',
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

  const useHandleAsHeader = streamPlayerControls.fullScreen.value
    ? false
    : useHandleAsHeaderSet;

  const showOnlyFullScreen =
    useHandleAsHeaderSet && streamPlayerControls.fullScreen.value;

  const isOpened =
    alwaysShowHeader || useHandleAsHeader || opened || showOnlyFullScreen;
  return (
    <motion.header
      data-opened={isOpened}
      data-always-show-header={alwaysShowHeader || showOnlyFullScreen}
      data-use-handle-as-header={useHandleAsHeader}
      style={style}
      animate={isOpened ? 'opened' : 'closed'}
      variants={headerVariants}
      transition={{ width: { type: 'spring', bounce: 0.2, duration: 0.5 } }}
      className="group/header data-[use-handle-as-header=false]:gray-dark absolute left-1 top-1 flex items-center overflow-hidden rounded-md bg-card/30 data-[use-handle-as-header=true]:static data-[use-handle-as-header=true]:bg-transparent"
    >
      {!alwaysShowHeader && !useHandleAsHeader && !showOnlyFullScreen && (
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
        {!(useHandleAsHeaderSet && streamPlayerControls.fullScreen.value) &&
          headerItemsSorted.map((item) => headerActions[item])}
        {useHandleAsHeaderSet &&
          streamPlayerControls.fullScreen.value &&
          headerActions.fullscreen}
      </div>
    </motion.header>
  );
};
