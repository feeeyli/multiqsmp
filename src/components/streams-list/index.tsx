'use client';

// Libs Imports
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

// Context Imports

// Scripts Imports
import { useHasMounted } from '@/hooks/useHasMounted';

// Components Imports
import { useLayout } from '@/contexts/layout-memory-context';
import { useSettings } from '@/contexts/settings-context';
import { useLayoutPresets } from '@/hooks/useLayoutPresets';
import { useStreamsList } from '@/hooks/useStreamsRenderList';
import { getLayoutKey } from '@/utils/getLayoutKey';
import { getStreamsGridSize } from '@/utils/getStreamsGridSize';
import { ArrowLeftRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { useElementSize, useMediaQuery } from 'usehooks-ts';
import { Chat } from '../chats/chat';
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
  const {
    layoutMemory: [layoutMemory, setLayoutMemory],
    layout: [layout, setLayout],
  } = useLayout();
  const [
    {
      streams: { movableChat },
    },
  ] = useSettings();
  const listWithChat = useStreamsList();

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

  const { columns: cols, rows } = getStreamsGridSize(
    listWithChat.length,
    isDesktop,
  );

  useEffect(() => {
    if (!hasMounted || containerSize.height === 0) return;

    const lay = layoutMemory[getLayoutKey(searchParams, { movableChat })];

    if (lay) return setLayout(lay);

    setLayout(tiles(generateBlankLayout(listWithChat)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, containerSize, hasMounted, layoutMemory]);

  const {
    focus: changeFocus,
    tiles,
    generateBlankLayout,
  } = useLayoutPresets(
    cols,
    rows,
    Math.ceil(containerSize.height / 36 / rows) * rows,
  );

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
            <span className="text-balance">{containerSize.height}</span>
            {/* <>
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
            </> */}
            <div>
              <Button
                size="sm"
                variant="link"
                onClick={() =>
                  setLayout(changeFocus(generateBlankLayout(listWithChat), 1))
                }
              >
                changeFocus(layout, 1)
              </Button>
              <Button
                size="sm"
                variant="link"
                onClick={() =>
                  setLayout(changeFocus(generateBlankLayout(listWithChat), 2))
                }
              >
                changeFocus(layout, 2)
              </Button>
              <Button
                size="sm"
                variant="link"
                onClick={() =>
                  setLayout(changeFocus(generateBlankLayout(listWithChat), 4))
                }
              >
                changeFocus(layout, 4)
              </Button>
              <Button
                size="sm"
                variant="link"
                onClick={() =>
                  setLayout(tiles(generateBlankLayout(listWithChat)))
                }
              >
                tiles(layout)
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      {listWithChat.length > 0 && (
        <ReactGridLayout
          className="grid-layout scrollbar max-h-full"
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
