import { useLayoutMemory } from '@/contexts/layout-memory-context';
import { useSettings } from '@/contexts/settings-context';
import { useFullscreen } from '@/hooks/useFullscreen';
import { getLayoutKey } from '@/utils/getLayoutKey';
import { Maximize, Minimize } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ResetLayout } from '../icons';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';
import { FAQDialog } from './faq-dialog';
import { OrganizeDialog } from './organize-dialog';
import { SettingsDialog } from './settings-dialog';
import { StreamsSelectorDialog } from './streams-selector-dialog';
import { StreamsSelectorDialogProvider } from './streams-selector-dialog/streams-selector-dialog-context';

export function DialogsAside() {
  const [settings] = useSettings();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [, setLayoutMemory] = useLayoutMemory();
  const { toggle, fullscreen } = useFullscreen();

  return (
    <aside
      data-dialogs-position={settings.appearance.dialogTriggersPosition}
      data-horizontal={settings.appearance.dialogTriggersPosition === 'bottom'}
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
      {!fullscreen && (
        <>
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
        </>
      )}
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
  );
}
