import { StreamerType } from '@/@types/data';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from '@/hooks/useTranslations';
import {
  BoxSelect,
  CheckSquare,
  Gamepad2,
  MousePointerSquareDashed,
  Radio,
} from 'lucide-react';
import { useStreamsSelector } from '../../selector-dialog-context';

type SelectStreamersDropdownProps = {
  streamersWithHide: StreamerType[];
};

export function SelectStreamersDropdown({
  streamersWithHide,
}: SelectStreamersDropdownProps) {
  const t = useTranslations('streamers-dialog');
  const { selectedStreamers } = useStreamsSelector();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex flex-grow items-center gap-2 px-2.5"
        >
          {t('select.label')}
          <MousePointerSquareDashed size="1rem" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            selectedStreamers.set(streamersWithHide);
          }}
        >
          <CheckSquare size="1rem" /> {t('select.all')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            selectedStreamers.set([]);
          }}
        >
          <BoxSelect size="1rem" /> {t('select.none')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            selectedStreamers.set(
              streamersWithHide.filter((streamer) => streamer.is_live),
            );
          }}
        >
          <Radio size="1rem" /> {t('select.online')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            selectedStreamers.set(
              streamersWithHide.filter((streamer) => streamer.is_playing_qsmp),
            );
          }}
        >
          <Gamepad2 size="1rem" /> {t('select.playing')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
