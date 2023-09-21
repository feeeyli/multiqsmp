// React Imports
import { Dispatch, SetStateAction } from 'react';

// Next Imports
import Image from 'next/image';

// Libs Imports
import { Reorder, useDragControls } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Icons Imports
import { GripVertical, X } from 'lucide-react';

// Scripts Imports
import { getSkinHead } from '@/utils/getSkinHead';

// Components Imports
import { Button } from '@/components/ui/button';

interface OrganizeListItemProps {
  channel: string;
  removeItem: Dispatch<SetStateAction<string[]>>;
}

export const OrganizeListItem = (props: OrganizeListItemProps) => {
  const t = useTranslations('organize-dialog');
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={props.channel}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2"
    >
      <Button
        size="sm"
        variant="ghost"
        className="h-auto p-1"
        onClick={() =>
          props.removeItem((old) =>
            old.filter((streamer) => streamer !== props.channel),
          )
        }
      >
        <X size="1rem" />
      </Button>
      <div className="flex flex-1 items-center gap-2">
        <div className="flex gap-1">
          {getSkinHead(props.channel).map((head) => (
            <Image
              src={head}
              key={head}
              alt={`${t('profile-image-alt')} ${props.channel}`}
              width={128}
              height={128}
              className="h-6 w-6"
            />
          ))}
        </div>
        {props.channel}
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical size="1rem" />
      </Button>
    </Reorder.Item>
  );
};
