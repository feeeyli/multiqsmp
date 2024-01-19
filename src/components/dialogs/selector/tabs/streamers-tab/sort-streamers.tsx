import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from '@/hooks/useTranslations';
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  CaseUpper,
  Languages,
} from 'lucide-react';
import { useSortStreamers } from './sort-streamers-context';

export function SortStreamers() {
  const t = useTranslations('streamers-dialog');
  const { direction, onlineFirst, playingFirst, sortMethod } =
    useSortStreamers();

  return (
    <div className="flex flex-grow">
      <Button
        variant="outline"
        className="rounded-r-none px-2"
        size="sm"
        onClick={() => direction.set((old) => (old === 'asc' ? 'des' : 'asc'))}
      >
        {direction.value === 'asc' && <ArrowDownWideNarrow size="1rem" />}
        {direction.value === 'des' && <ArrowUpWideNarrow size="1rem" />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="block flex-grow items-center gap-2 rounded-l-none border-l-0 px-2.5"
          >
            {t('sort.label')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={sortMethod.value}
            onValueChange={(value) =>
              sortMethod.set(value as typeof sortMethod.value)
            }
          >
            <DropdownMenuRadioItem value="name-lang">
              <Languages size="1rem" /> {t('sort.name-lang')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name">
              <CaseUpper size="1rem" /> {t('sort.name')}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={onlineFirst.value}
            onCheckedChange={onlineFirst.set}
          >
            {t('sort.online-first')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={playingFirst.value}
            onCheckedChange={playingFirst.set}
          >
            {t('sort.playing-first')}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
