'use client';

import { ChatsList } from '@/components/chats/chats-list';
import { DialogsAside } from '@/components/dialogs/aside/dialogs-aside';
import { WelcomeDialog } from '@/components/dialogs/welcome/welcome-dialog';
import { StreamsList } from '@/components/streams-list';
import { useEasterEggsContext } from '@/contexts/easter-eggs-context';
import { useSettings } from '@/contexts/settings-context';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useSearchParamsStates } from '@/hooks/useSearchParamsState';
import { useMediaQuery } from '@mantine/hooks';
import { cva } from 'class-variance-authority';
import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const mainVariants = cva(
  'group relative flex h-dvh max-h-screen w-full overflow-hidden',
  {
    variants: {
      'dialogs-position': {
        right: 'pr-8',
        bottom: 'pb-8',
        left: 'pl-8',
      },
    },
  },
);

export default function Streams() {
  const isDesktop = !useMediaQuery('(max-width: 640px)');
  const { streams, chats } = useSearchParamsStates();
  const [resizing, setResizing] = useState(false);
  const [settings] = useSettings();
  const [, setEasterEggs] = useEasterEggsContext();
  const { fullscreen } = useFullscreen();

  useKonamiCode(() => {
    setEasterEggs((old) => ({ ...old, active: true }));
  });

  return (
    <main
      data-has-chats={chats.length > 0}
      data-dialogs-position={settings.appearance.dialogTriggersPosition}
      className={mainVariants({
        'dialogs-position':
          settings.appearance.hideDialog || fullscreen
            ? undefined
            : settings.appearance.dialogTriggersPosition,
      })}
    >
      <DialogsAside />
      <PanelGroup direction={isDesktop ? 'horizontal' : 'vertical'}>
        <Panel
          minSize={30}
          defaultSize={100}
          data-resizing={resizing}
          className="data-[resizing=true]:pointer-events-none"
        >
          <StreamsList resizing={resizing} />
        </Panel>
        {chats.length > 0 &&
          streams.length > 0 &&
          !settings.streams.movableChat && (
            <>
              <PanelResizeHandle
                onDragging={(dragging) => setResizing(dragging)}
                className="relative p-2 before:absolute before:inset-1.5 before:block before:rounded-full before:bg-primary before:opacity-50 hover:before:opacity-70 active:before:opacity-100"
              />
              <Panel
                minSize={20}
                defaultSize={35}
                collapsedSize={0}
                collapsible
                data-resizing={resizing}
                className="
                data-[resizing=true]:pointer-events-none
                group-data-[dialogs-position=right]:mr-4"
              >
                <ChatsList resizing={resizing} />
              </Panel>
            </>
          )}
      </PanelGroup>
      {/* <ChangelogsDialog /> */}
      <WelcomeDialog />
    </main>
  );
}
