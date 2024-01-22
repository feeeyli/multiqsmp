import { useSettings } from '@/contexts/settings-context';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useTranslations } from '@/hooks/useTranslations';
import { Maximize, Minimize } from 'lucide-react';
import { Button } from '../../ui/button';
import { Tooltip } from '../../ui/tooltip';
import { EventsDialog } from '../events/events-dialog';
import { FAQDialog } from '../faq/faq-dialog';
import { OrganizeDialog } from '../organize/organize-dialog';
import { StreamsSelectorDialog } from '../selector/selector-dialog';
import { StreamsSelectorDialogProvider } from '../selector/selector-dialog-context';
import { SettingsDialog } from '../settings/settings-dialog';
import { LayoutDropdown } from './layout-dropdown';

export function DialogsAside() {
  const [settings] = useSettings();
  const t = useTranslations();
  const { toggle, fullscreen } = useFullscreen();

  return (
    <aside
      data-dialogs-position={settings.appearance.dialogTriggersPosition}
      data-horizontal={settings.appearance.dialogTriggersPosition === 'bottom'}
      data-hide-dialog={settings.appearance.hideDialog || false}
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
          <EventsDialog />
          <SettingsDialog />
          <FAQDialog />
          <LayoutDropdown />
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
