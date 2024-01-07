import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSettingsContext } from '@/contexts/settings-context';
import {
  BoxSelect,
  CheckSquare,
  Gamepad2,
  MousePointerSquareDashed,
  Radio,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useStreamsSelectorDialogContext } from '../../streams-selector-dialog-context';
import { OnlineStreamerType } from './streamers-tab';

type SelectStreamersDropdownProps = {
  streamersWithHide: {
    twitchName: string;
    displayName: string;
    avatarUrl: string;
  }[];
  onlineStreamers: OnlineStreamerType[];
};

export function SelectStreamersDropdown({
  streamersWithHide,
  onlineStreamers,
}: SelectStreamersDropdownProps) {
  const t = useTranslations('streamers-dialog');
  const { selectedStreamers } = useStreamsSelectorDialogContext();
  const [
    {
      streamers: { outro },
    },
  ] = useSettingsContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-2.5"
        >
          {t('select.label')}
          <MousePointerSquareDashed size="1rem" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            selectedStreamers.actions.updateList(
              streamersWithHide.map((s) => s.twitchName),
            );
          }}
        >
          <CheckSquare size="1rem" /> {t('select.all')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            selectedStreamers.actions.updateList([]);
          }}
        >
          <BoxSelect size="1rem" /> {t('select.none')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            selectedStreamers.actions.updateList(
              streamersWithHide
                .filter((streamer) => {
                  const stream = onlineStreamers.find(
                    (online) =>
                      online.twitchName.toLocaleLowerCase() ===
                      streamer.twitchName.toLocaleLowerCase(),
                  );

                  if (
                    !stream ||
                    (outro.hideOffline && !stream) ||
                    (outro.hideNotPlaying && !stream?.isPlayingQsmp && !!stream)
                  )
                    return false;

                  return true;
                })
                .map((s) => s.twitchName),
            );
          }}
        >
          <Radio size="1rem" /> {t('select.online')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            selectedStreamers.actions.updateList(
              streamersWithHide
                .filter((streamer) => {
                  const stream = onlineStreamers.find(
                    (online) =>
                      online.twitchName.toLocaleLowerCase() ===
                      streamer.twitchName.toLocaleLowerCase(),
                  );

                  if (
                    !stream?.isPlayingQsmp ||
                    (outro.hideOffline && !stream) ||
                    (outro.hideNotPlaying && !stream?.isPlayingQsmp && !!stream)
                  )
                    return false;

                  return true;
                })
                .map((s) => s.twitchName),
            );
          }}
        >
          <Gamepad2 size="1rem" /> {t('select.playing')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
