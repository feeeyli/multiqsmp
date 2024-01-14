'use client';

// Next Imports
import { useSearchParams } from 'next/navigation';

// Libs Imports
import { useMediaQuery } from 'usehooks-ts';

// Components Import
import { OrganizeDialog } from '@/components/dialogs/organize-dialog';
import { StreamsSelectorDialog } from '@/components/dialogs/streams-selector-dialog';

// Contexts Import
import { StreamsSelectorDialogProvider } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';

// Script Imports
import { ChatsList } from '@/components/chats-list';
import { ChangelogsDialog } from '@/components/dialogs/changelogs-dialog';
import { FAQDialog } from '@/components/dialogs/faq-dialog';
import { SettingsDialog } from '@/components/dialogs/settings-dialog';
import { WelcomeDialog } from '@/components/dialogs/welcome-dialog';
import { ResetLayout } from '@/components/icons';
import { StreamsList } from '@/components/streams-list';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useEasterEggsContext } from '@/contexts/easter-eggs-context';
import { useLayoutMemory } from '@/contexts/layout-memory-context';
import { useSettings } from '@/contexts/settings-context';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useSearchParamsStates } from '@/hooks/useSearchParamsState';
import { getLayoutKey } from '@/utils/getLayoutKey';
import { Maximize, Minimize } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function Streams() {
  const isDesktop = !useMediaQuery('(max-width: 640px)');
  const { streams, chats } = useSearchParamsStates();
  const [resizing, setResizing] = useState(false);
  const [settings] = useSettings();
  const t = useTranslations();
  const [, setEasterEggs] = useEasterEggsContext();
  const searchParams = useSearchParams();
  const [, setLayoutMemory] = useLayoutMemory();
  const { toggle, fullscreen } = useFullscreen();

  useKonamiCode(() => {
    setEasterEggs((old) => ({ ...old, active: true }));
  });

  return (
    <main
      data-has-chats={chats.length > 0}
      data-hide-dialog={settings.appearance.hideDialog}
      data-dialogs-position={settings.appearance.dialogTriggersPosition}
      className="
          group
          relative
          flex
          h-dvh
          max-h-dvh
          w-full
          overflow-hidden
          data-[dialogs-position=bottom]:pb-8
          data-[dialogs-position=left]:pl-8
          data-[dialogs-position=right]:pr-8
          data-[hide-dialog=true]:data-[dialogs-position=bottom]:!pb-0
          data-[hide-dialog=true]:data-[dialogs-position=left]:!pl-0
          data-[hide-dialog=true]:data-[dialogs-position=right]:!pr-0
        "
    >
      <aside
        data-dialogs-position={settings.appearance.dialogTriggersPosition}
        data-horizontal={
          settings.appearance.dialogTriggersPosition === 'bottom'
        }
        data-hide-dialog={settings.appearance.hideDialog}
        className="
            group
            absolute
            z-50
            flex
            flex-col
            gap-2
            transition-transform
            data-[dialogs-position=bottom]:bottom-0
            data-[dialogs-position=bottom]:right-0
            data-[dialogs-position=left]:left-0
            data-[dialogs-position=right]:right-0
            data-[dialogs-position=bottom]:data-[hide-dialog=true]:translate-y-[80%]
            data-[dialogs-position=left]:data-[hide-dialog=true]:-translate-x-[80%]
            data-[dialogs-position=right]:data-[hide-dialog=true]:translate-x-[80%]
            data-[horizontal=true]:flex-row-reverse
            data-[horizontal=false]:py-6
            data-[horizontal=true]:px-3
            hover:data-[hide-dialog=true]:translate-x-0
            hover:data-[hide-dialog=true]:translate-y-0
            [&>a]:data-[dialogs-position=bottom]:rounded-b-none
            [&>a]:data-[dialogs-position=left]:rounded-l-none
            [&>a]:data-[dialogs-position=right]:rounded-r-none
            [&>button]:data-[dialogs-position=bottom]:rounded-b-none
            [&>button]:data-[dialogs-position=left]:rounded-l-none
            [&>button]:data-[dialogs-position=right]:rounded-r-none
          "
      >
        <StreamsSelectorDialogProvider>
          <StreamsSelectorDialog />
        </StreamsSelectorDialogProvider>
        <OrganizeDialog />
        <SettingsDialog />
        {/* <EventsDialog /> */}
        <FAQDialog />
        <Tooltip title={t('button-titles.aside.reset-layout')}>
          <Button
            className="mt-4 px-3 group-data-[dialogs-position=bottom]:mr-2.5 group-data-[dialogs-position=bottom]:mt-0"
            size="sm"
            onClick={() => {
              setLayoutMemory((old) => {
                const {
                  [getLayoutKey(searchParams, {
                    movableChat: settings.streams.movableChat,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  })]: _,
                  ...rest
                } = old;
                return rest;
              });
            }}
          >
            <ResetLayout size="1rem" className="block text-secondary" />
          </Button>
        </Tooltip>
        <Tooltip title={t('button-titles.aside.toggle-fullscreen')}>
          <Button
            className="px-3 md:data-[fullscreen=false]:sr-only"
            data-fullscreen={fullscreen}
            size="sm"
            onClick={toggle}
          >
            {!fullscreen && <Maximize size="1rem" className="text-secondary" />}
            {fullscreen && <Minimize size="1rem" className="text-secondary" />}
          </Button>
        </Tooltip>
      </aside>
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
      <WelcomeDialog />
      <ChangelogsDialog />
    </main>
  );
}
