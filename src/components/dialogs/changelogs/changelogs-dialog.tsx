/* eslint-disable @typescript-eslint/no-unused-vars */
import { Changelogs } from '@/changelogs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/useTranslations';
import { useLocalStorage } from '@mantine/hooks';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogOverlay } from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import Markdown from 'react-markdown';

const ACTUAL_VERSION = '3.1';

export const ChangelogsDialog = () => {
  const t = useTranslations('changelogs-dialog');
  const locale = useLocale() as keyof typeof Changelogs;
  const [changelogsView, setChangelogsView] = useLocalStorage<string[]>({
    key: 'changelogs-view',
    defaultValue: [],
  });

  const Versions = Object.keys(Changelogs[locale]);
  const versionIndex = Versions.findIndex((cl) => cl === ACTUAL_VERSION) + 1;

  const ChangelogsNotViewed = Versions.slice(
    versionIndex - 3 < 0 ? 0 : versionIndex - 3,
    versionIndex,
  ).filter(
    (v) => !changelogsView.includes(v),
  ) as (keyof typeof Changelogs.pt)[];

  const Changelog = ChangelogsNotViewed.map((v) => Changelogs[locale][v])
    .join('\n \n  ---\n  \n')
    .split('---');
  const [page, setPage] = useState(0);

  return (
    <Dialog
      defaultOpen={ChangelogsNotViewed.length > 0 && changelogsView.length > 0}
      open={ChangelogsNotViewed.length === 0 ? false : undefined}
      onOpenChange={(open) => {
        if (!open) setChangelogsView((old) => [...old, ...ChangelogsNotViewed]);
      }}
    >
      <DialogOverlay className="fixed inset-0 z-[51] bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-[51] grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <main>
          {Changelog.map((changelog, i) => (
            <div
              className="data-[active=false]:hidden"
              key={i}
              data-active={i === page}
            >
              <Markdown
                className="changelog-markdown"
                components={{
                  img: ({ src, alt, node, ...rest }) => (
                    <Link href={src!} target="_blank">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={alt} {...rest} className="mx-auto" />
                    </Link>
                  ),
                  li: ({ children, node: _, ...props }) => (
                    <li {...props}>
                      <p>{children}</p>
                    </li>
                  ),
                }}
              >
                {changelog}
              </Markdown>
            </div>
          ))}
          <footer className="mt-3 flex justify-between">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((old) => --old)}
              disabled={page <= 0}
            >
              <ChevronLeft size="1rem" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((old) => ++old)}
              disabled={page >= Changelog.length - 1}
            >
              <ChevronRight size="1rem" />
            </Button>
          </footer>
        </main>
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </Dialog>
  );
};
