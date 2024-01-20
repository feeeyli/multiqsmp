import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/useTranslations';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogOverlay, DialogPortal } from '@radix-ui/react-dialog';
import {
  ArrowLeftRight,
  HelpCircle,
  ListOrdered,
  Settings,
  X,
} from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

export const WelcomeDialog = () => {
  const t = useTranslations('welcome-dialog');
  const [notFirstView, setNotFirstView] = useLocalStorage(
    'not-first-view',
    false,
  );

  return (
    <Dialog
      defaultOpen={!notFirstView}
      open={notFirstView ? false : undefined}
      onOpenChange={(open) => {
        if (!open) setNotFirstView(true);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-[51] bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-[51] grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{t('description')}</DialogDescription>
          <div className="space-y-3">
            <div className="flex gap-5">
              <Button className="mt-4 px-3" size="sm" asChild>
                <div>
                  <ArrowLeftRight
                    size="1rem"
                    className="block text-secondary"
                  />
                </div>
              </Button>
              <div>
                <span>{t('selector.title')}</span>
                <p className="indent-2 text-sm text-muted-foreground">
                  {t('selector.content')}
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <Button className="mt-4 px-3" size="sm" asChild>
                <div>
                  <ListOrdered size="1rem" className="block text-secondary" />
                </div>
              </Button>
              <div>
                <span>{t('organizer.title')}</span>
                <p className="indent-2 text-sm text-muted-foreground">
                  {t('organizer.content')}
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <Button className="mt-4 px-3" size="sm" asChild>
                <div>
                  <Settings size="1rem" className="block text-secondary" />
                </div>
              </Button>
              <div>
                <span>{t('settings.title')}</span>
                <p className="indent-2 text-sm text-muted-foreground">
                  {t('settings.content')}
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <Button className="mt-4 px-3" size="sm" asChild>
                <div>
                  <HelpCircle size="1rem" className="block text-secondary" />
                </div>
              </Button>
              <div>
                <span>{t('faq.title')}</span>
                <p className="indent-2 text-sm text-muted-foreground">
                  {t('faq.content')}
                </p>
              </div>
            </div>
          </div>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
