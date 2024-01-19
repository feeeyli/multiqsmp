import { useTranslations } from '@/hooks/useTranslations';
import { Loader2 } from 'lucide-react';

export function Loading({ searchMode }: { searchMode: 'qsmp' | 'twitch' }) {
  const t = useTranslations('streamers-dialog');

  return (
    <div className="flex w-full items-center justify-center gap-3 py-2 text-xs text-muted-foreground">
      <Loader2 size="1rem" className="animate-spin" />
      <span>{t('loading-streamers', { type: searchMode })}</span>
    </div>
  );
}
