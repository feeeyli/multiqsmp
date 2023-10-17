'use client';

// Next Imports
import { useRouter } from 'next/navigation';

// Libs Imports
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { useMediaQuery } from 'usehooks-ts';

// Components Import
import { OrganizeStreamsDialog } from '@/components/dialogs/organize-streams-dialog';
import { StreamsSelectorDialog } from '@/components/dialogs/streams-selector-dialog';

// Contexts Import
import { StreamsSelectorDialogProvider } from '@/components/dialogs/streams-selector-dialog/streams-selector-dialog-context';
import { StreamsList } from '@/components/streams-list';

// Script Imports
import { useSearchParamsStates } from '@/utils/useSearchParamsState';
import { useState } from 'react';
import { ChatsList } from '@/components/chats-list';
import { parseChannels } from '@/utils/parseChannels';
import { SettingsDialog } from '@/components/dialogs/settings-dialog';
import { FAQDialog } from '@/components/dialogs/faq-dialog';
import { useCustomGroupsContext } from '@/contexts/custom-groups-context';

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
      className="relative flex h-screen max-h-screen w-full pr-8 data-[has-chats=true]:pr-10"
    >
      <aside className="absolute right-0 z-10 flex h-full flex-col gap-2 py-6">
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
              className="data-[resizing=true]:pointer-events-none"
            >
              <ChatsList resizing={resizing} />
            </Panel>
          </>
        )}
      </PanelGroup>
    </main>
  );
}
