'use client';

// Libs Imports
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

// Context Imports

// Scripts Imports
import { useHasMounted } from '@/hooks/useHasMounted';

// Components Imports
import { useLayoutMemory } from '@/contexts/layout-memory-context';
import { useSettings } from '@/contexts/settings-context';
import { SwapStreamsProvider } from '@/contexts/swap-points-context';
import { useQueryData } from '@/hooks/useQueryData';
import { getLayoutKey } from '@/utils/getLayoutKey';
import { getStreamsGridSize } from '@/utils/getStreamsGridSize';
import { ArrowLeftRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { useElementSize, useMediaQuery } from 'usehooks-ts';
import { Chat } from '../chats-list/chat';
import { Button } from '../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { StreamPlayer } from './stream-player';
import { StreamPlayerControlsProvider } from './stream-player/stream-player-controls-context';

const DEBUG_MODE =
  typeof localStorage === 'undefined'
    ? false
    : localStorage.getItem('DEBUG_MODE') === 'true'
    ? true
    : false;

type Streams = {
  twitch_name: string;
  group_name?: string;
  is_chat: boolean;
}[];

interface StreamsListProps {
  resizing: boolean;
}

export const StreamsList = (props: StreamsListProps) => {
  const isDesktop = !useMediaQuery('(max-width: 640px)');
  const searchParams = useSearchParams();
  const t = useTranslations('streams-list');
  const hasMounted = useHasMounted();
  const ReactGridLayout = useMemo(() => WidthProvider(RGL), []);
  const [isMoving, setIsMoving] = useState(false);
  const [layoutMemory, setLayoutMemory] = useLayoutMemory();
  const [
    {
      streams: { movableChat },
    },
  ] = useSettings();
  const [streamersOnQuery, groupsOnQuery] = useQueryData();

  const movingHandles = {
    start() {
      setIsMoving(true);
    },
    stop(lay: Layout[]) {
      setLayoutMemory((old) => {
        const n = { ...old };

        n[getLayoutKey(searchParams, { movableChat })] = lay;

        return n;
      });

      setIsMoving(false);
    },
  };

  const [containerRef, containerSize] = useElementSize();

  const chatsOnQuery = searchParams.get('chats')?.split('/') || [];

  const mergedStreams: Streams = Array.from([
    ...groupsOnQuery
      .map((group) =>
        group.members
          .filter((member) => !member.is_hidden)
          .map((member) => ({
            twitch_name: member.twitch_name,
            group_name: group.simple_name,
            is_chat: false,
          })),
      )
      .flat(),
    ...streamersOnQuery.map((s) => ({
      twitch_name: s.twitch_name,
      group_name: undefined,
      is_chat: false,
    })),
  ]);

  const mergedStreamsWithoutDuplicates = Array.from(
    new Set(mergedStreams.map((item) => item.twitch_name)),
  ).map((twitch_name) => {
    const itemWithGroupName = mergedStreams.find(
      (item) => item.twitch_name === twitch_name && item.group_name,
    );
    return (
      itemWithGroupName ||
      mergedStreams.find((item) => item.twitch_name === twitch_name)
    );
  }) as Streams;

  const listWithChat: Streams = [
    ...mergedStreamsWithoutDuplicates,
    ...(movableChat ? chatsOnQuery : []).map((c) => ({
      twitch_name: c,
      group_name: undefined,
      is_chat: true,
    })),
  ];

  const { columns: cols, rows } = getStreamsGridSize(
    listWithChat.length,
    isDesktop,
  );

  function getGridData(i: number) {
    const def = {
      y: Math.floor(i / cols),
      x: (i % cols) * 10,
      w: 10,
      h: Math.ceil(containerSize.height / 36 / rows),
    };

    const layout = layoutMemory[getLayoutKey(searchParams, { movableChat })];

    if (layout) {
      const item = layout.find((l) => l.i === String(i));

      if (item) return item;

      return def;
    }

    return def;
  }

  const [layout, setLayout] = useState<Layout[]>([]);

  useEffect(() => {
    if (!hasMounted || containerSize.height === 0) return;

    setLayout(
      listWithChat.map((_, i) => ({ i: String(i), ...getGridData(i) })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, containerSize, hasMounted, layoutMemory]);

  if (!hasMounted) return null;

  return (
    <div
      data-resizing={props.resizing}
      data-has-chat-open={!!searchParams.get('chats')}
      className="streams-list-scrollbar relative h-full flex-1 overflow-auto data-[resizing=true]:pointer-events-none"
      ref={containerRef}
    >
      {DEBUG_MODE && (
        <Collapsible
          defaultOpen
          className="absolute right-1 top-2 z-50 flex flex-col gap-3 rounded-md bg-slate-950/50 p-4"
        >
          <CollapsibleTrigger className="text-xl font-bold">
            DEBUG
          </CollapsibleTrigger>
          <CollapsibleContent className="max-w-72">
            <span className="text-balance">
              {listWithChat.map((i) => i.twitch_name).join(', ')}
            </span>
            <textarea
              className="w-full resize-y p-1.5 font-mono text-xs"
              id="new-layout-textarea"
            ></textarea>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setLayout(
                  JSON.parse(
                    (
                      document.querySelector(
                        '#new-layout-textarea',
                      ) as HTMLTextAreaElement
                    ).value,
                  ),
                )
              }
            >
              Update Layout
            </Button>
            <pre className="scrollbar max-h-[512px] overflow-auto text-xs">
              {JSON.stringify(layout, null, 2)}
            </pre>
            {/* <div>
              <Button size="sm" variant="link" asChild>
                <Link href="/pt">Re</Link>
              </Button>
              <Button size="sm" variant="link" asChild>
                <Link href="/pt?streamers=scottonauta">Set</Link>
              </Button>
            </div> */}
          </CollapsibleContent>
        </Collapsible>
      )}
      {listWithChat.length > 0 && (
        <SwapStreamsProvider
          layout={{ value: layout, set: setLayout }}
          getLayoutKey={(sp) => getLayoutKey(sp, { movableChat })}
        >
          {
            <ReactGridLayout
              className="grid-layout max-h-full"
              cols={10 * cols}
              rowHeight={
                containerSize.height /
                  (Math.ceil(containerSize.height / 36 / rows) * rows) -
                4.1
              }
              resizeHandles={['sw', 'se']}
              draggableHandle=".handle"
              onDragStart={movingHandles.start}
              onDragStop={movingHandles.stop}
              onResizeStart={movingHandles.start}
              onResizeStop={movingHandles.stop}
              onLayoutChange={(lay) => {
                if (lay.some((i) => i.h === 1 && i.w === 1)) return;

                setLayout(lay);
              }}
              layout={layout}
              margin={[4, 4]}
            >
              {listWithChat.map((channel, i) => (
                <div
                  key={i}
                  className="grid-layout-item flex select-none flex-col rounded-sm bg-muted"
                >
                  {!channel.is_chat && (
                    <StreamPlayerControlsProvider index={i}>
                      <StreamPlayer
                        channel={channel.twitch_name}
                        groupName={channel.group_name}
                        isMoving={isMoving}
                        layout={layout}
                      />
                    </StreamPlayerControlsProvider>
                  )}
                  {channel.is_chat && (
                    <Chat chat={channel.twitch_name} isMoving={isMoving} />
                  )}
                </div>
              ))}
            </ReactGridLayout>
          }
        </SwapStreamsProvider>
      )}
      {listWithChat.length === 0 && (
        <div className="absolute left-1/2 top-1/2 flex w-[85%] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-12 ">
          <div className="text-center">
            {t('no-streams').split('((button))')[0]}
            <ArrowLeftRight size="1.25rem" className="inline text-primary" />
            {t('no-streams').split('((button))')[1]}
          </div>
        </div>
      )}
    </div>
  );
};
