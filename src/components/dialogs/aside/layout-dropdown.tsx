import { FourFocus, OneFocus, ResetLayout, TwoFocus } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip } from '@/components/ui/tooltip';
import { useLayout } from '@/contexts/layout-memory-context';
import { useSettings } from '@/contexts/settings-context';
import { useLayoutPresets } from '@/hooks/useLayoutPresets';
import { useStreamsList } from '@/hooks/useStreamsRenderList';
import { useTranslations } from '@/hooks/useTranslations';
import { getLayoutKey } from '@/utils/getLayoutKey';
import { getStreamsGridSize } from '@/utils/getStreamsGridSize';
import { LayoutPanelLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMediaQuery, useWindowSize } from 'usehooks-ts';

export function LayoutDropdown() {
  const isDesktop = !useMediaQuery('(max-width: 640px)');
  const [settings] = useSettings();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const listWithChat = useStreamsList();
  const { height } = useWindowSize();
  const {
    layoutMemory: [, setLayoutMemory],
  } = useLayout();

  const { columns: cols, rows } = getStreamsGridSize(
    listWithChat.length,
    isDesktop,
  );

  const {
    focus: changeFocus,
    tiles,
    generateBlankLayout,
  } = useLayoutPresets(cols, rows, Math.ceil(height / 36 / rows) * rows);

  function focus(num: 1 | 2 | 4) {
    setLayoutMemory((old) => {
      return {
        ...old,
        [getLayoutKey(searchParams, {
          movableChat: settings.streams.movableChat,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        })]: changeFocus(tiles(generateBlankLayout(listWithChat)), num),
      };
    });
  }

  return (
    <DropdownMenu>
      <Tooltip title={t('button-titles.aside.layout')}>
        <DropdownMenuTrigger asChild>
          <Button
            className="mt-4 px-3 group-data-[dialogs-position=bottom]:mr-2.5 group-data-[dialogs-position=bottom]:mt-0"
            size="sm"
          >
            <LayoutPanelLeft size="1rem" className="block text-secondary" />
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent side="left">
        <DropdownMenuItem
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
          <ResetLayout size="1rem" /> {t('button-titles.aside.reset-layout')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => focus(1)}>
          <OneFocus size="1rem" /> {t('button-titles.aside.1-focus')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => focus(2)}>
          <TwoFocus size="1rem" /> {t('button-titles.aside.2-focus')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => focus(4)}>
          <FourFocus size="1rem" /> {t('button-titles.aside.4-focus')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
