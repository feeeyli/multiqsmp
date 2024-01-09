import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Globe2, Twitch, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';

type SearchBar = {
  handleTwitchSearch: (query: string) => void;
  handleDefaultSearch: (query: string) => void;
  onSearchModeChange: Dispatch<SetStateAction<'qsmp' | 'twitch'>>;
  searchMode: 'qsmp' | 'twitch';
};

export function SearchBar(props: SearchBar) {
  const t = useTranslations('streamers-dialog');
  const [search, setSearch] = useState('');
  const debouncedValue = useDebounce<string>(
    props.searchMode === 'twitch' ? search : '',
    500,
  );

  useEffect(() => {
    if (props.searchMode === 'twitch') props.handleTwitchSearch(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, props.searchMode]);

  useEffect(() => {
    if (props.searchMode === 'qsmp') props.handleDefaultSearch(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, props.searchMode]);

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
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <Button
          variant="outline"
          className="rounded-l-none border-l-0 px-3 text-muted-foreground"
          onClick={() => setSearch('')}
        >
          <XCircle size="1rem" />
        </Button>
      </div>
      <Button
        variant="outline"
        className="items-start p-0"
        onClick={() => {
          props.onSearchModeChange((old) =>
            old === 'qsmp' ? 'twitch' : 'qsmp',
          );
          setSearch('');
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
