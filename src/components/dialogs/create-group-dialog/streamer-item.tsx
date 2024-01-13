// Next Imports
import Image from 'next/image';

// Libs Imports
import { useTranslations } from 'next-intl';

// Types Imports
import { SimpleStreamerType } from '@/@types/data';

// Components Imports
import * as ToggleGroup from '@radix-ui/react-toggle-group';

// Contexts Imports
import { Button } from '@/components/ui/button';

interface StreamerItemProps {
  streamer: SimpleStreamerType;
}

export const StreamerItem = (props: StreamerItemProps) => {
  const t = useTranslations('create-group-dialog');

  return (
    <ToggleGroup.Item
      value={props.streamer.twitch_name}
      asChild
      className="flex h-auto min-w-[40%] flex-1 items-center justify-start gap-4 border-2 bg-secondary/50 p-2 data-[state=on]:border-primary/50 data-[state=on]:bg-secondary/50"
    >
      <Button variant="secondary">
        <Image
          src={props.streamer.avatar_url}
          alt={`${t('profile-image-alt')} ${props.streamer.display_name}`}
          width={96}
          height={96}
          className="h-12 w-12 rounded-md"
        />
        <span>{props.streamer.display_name}</span>
      </Button>
    </ToggleGroup.Item>
  );
};
