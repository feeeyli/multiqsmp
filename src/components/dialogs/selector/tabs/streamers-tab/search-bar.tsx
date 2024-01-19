import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Globe2, Twitch, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, ElementRef, useRef } from 'react';

type SearchBar = {
  toggleSearchMode: () => void;
  searchMode: 'qsmp' | 'twitch';
  setSearch: (e: ChangeEvent<HTMLInputElement> | string) => void;
  search: string;
};

export function SearchBar(props: SearchBar) {
  const t = useTranslations('streamers-dialog');
  const inputRef = useRef<ElementRef<'input'>>(null);

  function clearInput() {
    props.setSearch('');
  }

  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex w-full">
        <Label className="sr-only" htmlFor="streamer-search">
          {t(props.searchMode + '-streamer-search-label')}
        </Label>
        <Input
          type="text"
          id="streamer-search"
          className="rounded-r-none border-r-0"
          placeholder={t(props.searchMode + '-streamer-search-label')}
          onChange={props.setSearch}
          value={props.search}
          ref={inputRef}
        />
        <Button
          variant="outline"
          className="rounded-l-none border-l-0 px-3 text-muted-foreground"
          onClick={() => clearInput()}
        >
          <XCircle size="1rem" />
        </Button>
      </div>
      <Button
        variant="outline"
        className="items-start p-0"
        onClick={() => {
          props.toggleSearchMode();
          clearInput();
        }}
      >
        <div className="relative h-10 w-10 overflow-y-hidden">
          <motion.div
            className="absolute"
            variants={{
              qsmp: {
                top: 0,
              },
              twitch: {
                top: '-100%',
              },
            }}
            animate={props.searchMode}
          >
            <div className="flex h-10 w-10 items-center justify-center">
              <Globe2 size="1rem" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center">
              <Twitch size="1rem" />
            </div>
          </motion.div>
        </div>
      </Button>
    </div>
  );
}
