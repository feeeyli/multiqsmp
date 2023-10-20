'use client';

// Next Imports
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Libs Imports
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { useLocalStorage } from 'usehooks-ts';

// Components Import
import { OrganizeStreamsDialog } from '@/components/dialogs/organize-streams-dialog';
import { StreamsSelectorDialog } from '@/components/dialogs/streams-selector-dialog';

// Contexts Import
import { StreamsSelectorDialogProvider } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { StreamsList } from '@/components/streams-list';

// Script Imports
import { useSearchParamsStates } from '@/utils/useSearchParamsState';
import { useEffect, useState } from 'react';
import { ChatsList } from '@/components/chats-list';
import { parseChannels } from '@/utils/parseChannels';
import { SettingsDialog } from '@/components/dialogs/settings-dialog';
import { FAQDialog } from '@/components/dialogs/faq-dialog';
import { useCustomGroupsContext } from '@/contexts/custom-groups-context';
import { useSettingsContext } from '@/contexts/settings-context';

interface StreamsPageProps {
  params: {
    locale: string;
    streams?: string[];
  };
}

export default function Streams(props: StreamsPageProps) {
  const isDesktop = window.innerWidth > 640;
  const { streams, chats } = useSearchParamsStates();
  const [resizing, setResizing] = useState(false);
  const [customGroups] = useCustomGroupsContext();
  const [settings] = useSettingsContext();
  const router = useRouter();

  if (props.params.streams) {
    const [selectedChannels, , selectedGroups] = parseChannels(
      props.params.streams || [],
      customGroups,
    );

    router.replace(
      `/${props.params.locale}?${
        selectedChannels.length > 0
          ? 'streamers=' + selectedChannels.join('/')
          : ''
      }${
        selectedGroups.length > 0 ? '&groups=' + selectedGroups.join('/') : ''
      }`,
    );
  }

  return (
    <main
      data-has-chats={chats.length > 0}
      data-hide-dialog={settings.appearance.hideDialog}
      data-dialogs-position={settings.appearance.dialogTriggersPosition}
      className="
        group
        relative
        flex
        h-screen
        max-h-screen
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
          z-10
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
          [&>button]:data-[dialogs-position=bottom]:rounded-b-none
          [&>button]:data-[dialogs-position=left]:rounded-l-none
          [&>button]:data-[dialogs-position=right]:rounded-r-none
        "
      >
        <StreamsSelectorDialogProvider>
          <StreamsSelectorDialog />
        </StreamsSelectorDialogProvider>
        <OrganizeStreamsDialog />
        <SettingsDialog />
        <FAQDialog />
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
        {chats.length > 0 && streams.length > 0 && (
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
    </main>
  );
}
