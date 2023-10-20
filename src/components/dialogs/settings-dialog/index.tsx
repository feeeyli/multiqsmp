'use client';

// Libs Imports
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Icons Imports
import {
  ChevronsLeft,
  ChevronsRight,
  LucideIcon,
  Maximize,
  MessageSquare,
  RefreshCcw,
  Save,
  Settings,
  Volume2,
  X,
} from 'lucide-react';

// Components Imports
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Contexts Imports
import { useSettingsContext } from '@/contexts/settings-context';
import { useState } from 'react';
import { Reorder } from 'framer-motion';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { ChangeLanguage } from './change-language';
import {
  DiscardChangesDialog,
  DiscardChangesDialogContent,
  DiscardChangesDialogTrigger,
} from './discard-changes-dialog';
import { DialogClose } from '@radix-ui/react-dialog';

const headerItemsNames = z.enum([
  'mute',
  'fullscreen',
  'chat',
  'reload',
  'remove-stream',
  'move-left',
  'move-right',
]);

const headerItems: {
  value: z.infer<typeof headerItemsNames>;
  icon: LucideIcon;
}[] = [
  { value: 'mute', icon: Volume2 },
  { value: 'fullscreen', icon: Maximize },
  { value: 'chat', icon: MessageSquare },
  { value: 'reload', icon: RefreshCcw },
  { value: 'remove-stream', icon: X },
  { value: 'move-left', icon: ChevronsLeft },
  { value: 'move-right', icon: ChevronsRight },
];

const settingsFormSchema = z.object({
  appearance: z.object({
    theme: z.enum(['dark', 'light', 'gray-dark', 'gray-light', 'system']),
    dialogTriggersPosition: z.enum(['right', 'bottom', 'left']),
    hideDialog: z.boolean(),
  }),
  streamers: z.object({
    streamersAvatar: z.enum(['twitch', 'skin', 'both']),
    streamStatus: z.object({
      offline: z.boolean(),
      noPlaying: z.boolean(),
    }),
    outro: z.object({
      hideOffline: z.boolean(),
      hideNotPlaying: z.boolean(),
    }),
  }),
  streams: z.object({
    alwaysShowHeader: z.boolean(),
    headerItems: z.array(headerItemsNames) /**z.array(z.object({
      value: headerItemsNames,
      subtitle: z.boolean()
    }).transform(h => h.value)) */,
    startMuted: z.boolean(),
  }),
});

export type SettingsType = z.infer<typeof settingsFormSchema>;

export const SettingsDialog = () => {
  const t = useTranslations('settings-dialog');
  const [settings, setSettings] = useSettingsContext();
  const form = useForm<SettingsType>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: settings,
  });
  const [isOpen, setIsOpen] = useState(false);

  function onSubmit(values: SettingsType) {
    setSettings(values);
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="mt-4 px-3 group-data-[dialogs-position=bottom]:mr-2.5 group-data-[dialogs-position=bottom]:mt-0"
          size="sm"
        >
          <Settings size="1rem" className="block text-primary-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="scrollbar max-h-[75vh] space-y-4 overflow-y-auto pl-2 pr-4">
            <div>
              <ChangeLanguage lang="pt" form={form} />
              <ChangeLanguage lang="en" form={form} />
              <ChangeLanguage lang="es" form={form} />
              <ChangeLanguage lang="fr" form={form} />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-primary">
                {t('form.appearance.title')}
              </h3>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="appearance.theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.appearance.theme.label')}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          // setTheme(value);
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t('form.appearance.theme.label')}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dark">
                            {t('form.appearance.theme.dark')}
                          </SelectItem>
                          <SelectItem value="light">
                            {t('form.appearance.theme.light')}
                          </SelectItem>
                          <SelectItem value="gray-dark">
                            {t('form.appearance.theme.gray-dark')}
                          </SelectItem>
                          <SelectItem value="gray-light">
                            {t('form.appearance.theme.gray-light')}
                          </SelectItem>
                          <SelectItem value="system">
                            {t('form.appearance.theme.system')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appearance.dialogTriggersPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('form.appearance.dialog-position.label')}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                'form.appearance.dialog-position.label',
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="right">
                            {t('form.appearance.dialog-position.right')}
                          </SelectItem>
                          <SelectItem value="bottom">
                            {t('form.appearance.dialog-position.bottom')}
                          </SelectItem>
                          <SelectItem value="left">
                            {t('form.appearance.dialog-position.left')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-3">
                  <span className="text-sm">
                    {t('form.appearance.outro.label')}
                  </span>
                  <FormField
                    control={form.control}
                    name="appearance.hideDialog"
                    render={({ field }) => (
                      <Button
                        variant="outline"
                        className="flex justify-start"
                        asChild
                      >
                        <label>
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!m-0">
                              {t('form.appearance.outro.hide-dialog')}
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        </label>
                      </Button>
                    )}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-primary">
                {t('form.streamers.title')}
              </h3>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="streamers.streamersAvatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('form.streamers.streams-avatar.label')}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                'form.streamers.streams-avatar.label',
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="twitch">
                            {t('form.streamers.streams-avatar.twitch')}
                          </SelectItem>
                          <SelectItem value="skin">
                            {t('form.streamers.streams-avatar.skin')}
                          </SelectItem>
                          <SelectItem value="both">
                            {t('form.streamers.streams-avatar.both')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-3">
                  <span className="text-sm">
                    {t('form.streamers.streams-status.label')}
                  </span>
                  <FormField
                    control={form.control}
                    name="streamers.streamStatus.offline"
                    render={({ field }) => (
                      <Button
                        variant="outline"
                        className="flex justify-start"
                        asChild
                      >
                        <label>
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!m-0">
                              {t('form.streamers.streams-status.offline')}
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        </label>
                      </Button>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="streamers.streamStatus.noPlaying"
                    render={({ field }) => (
                      <Button
                        variant="outline"
                        className="flex justify-start"
                        asChild
                      >
                        <label>
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!m-0">
                              {t('form.streamers.streams-status.noPlaying')}
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        </label>
                      </Button>
                    )}
                  />
                </div>
                <div className="space-y-3">
                  <span className="text-sm">
                    {t('form.streamers.outro.label')}
                  </span>
                  <FormField
                    control={form.control}
                    name="streamers.outro.hideOffline"
                    render={({ field }) => (
                      <Button
                        variant="outline"
                        className="flex justify-start"
                        asChild
                      >
                        <label>
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!m-0">
                              {t('form.streamers.outro.hide-offline')}
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        </label>
                      </Button>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="streamers.outro.hideNotPlaying"
                    render={({ field }) => (
                      <Button
                        variant="outline"
                        className="flex justify-start"
                        asChild
                      >
                        <label>
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!m-0">
                              {t('form.streamers.outro.hide-not-playing')}
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        </label>
                      </Button>
                    )}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-primary">
                {t('form.streams.title')}
              </h3>
              <div className="space-y-3">
                <span className="block text-sm">
                  {t('form.streams.headers.label')}
                </span>
                <FormField
                  control={form.control}
                  name="streams.alwaysShowHeader"
                  render={({ field }) => (
                    <Button
                      variant="outline"
                      className="flex justify-start"
                      asChild
                    >
                      <label>
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!m-0">
                            {t('form.streams.headers.always-show')}
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      </label>
                    </Button>
                  )}
                />
                <span className="block text-sm">
                  {t('form.streams.headers.actions-order.label')}
                </span>
                <FormField
                  control={form.control}
                  name="streams.headerItems"
                  render={({ field }) => (
                    <ToggleGroup.Root
                      type="multiple"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col gap-2"
                    >
                      {headerItems.map((item) => {
                        return (
                          <FormItem
                            key={item.value}
                            className="flex items-center gap-2"
                          >
                            <FormControl>
                              <ToggleGroup.Item
                                value={item.value}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                              >
                                <item.icon size="1rem" />
                                <FormLabel className="!m-0 cursor-pointer">
                                  {t(
                                    `form.streams.headers.actions-order.actions-labels.${item.value}`,
                                  )}
                                </FormLabel>
                                <FormMessage />
                              </ToggleGroup.Item>
                            </FormControl>
                          </FormItem>
                        );
                      })}
                    </ToggleGroup.Root>
                  )}
                />
                <span className="block text-sm">
                  {t('form.streams.outro.label')}
                </span>
                <FormField
                  control={form.control}
                  name="streams.startMuted"
                  render={({ field }) => (
                    <Button
                      variant="outline"
                      className="flex justify-start"
                      asChild
                    >
                      <label>
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!m-0">
                            {t('form.streams.outro.start-muted')}
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      </label>
                    </Button>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter className="flex gap-2">
          {form.formState.isDirty ? (
            <DiscardChangesDialog form={form}>
              <DiscardChangesDialogTrigger>
                <Button variant="ghost">{t('cancel')}</Button>
              </DiscardChangesDialogTrigger>
              <DiscardChangesDialogContent
                confirm={
                  <DialogClose asChild>
                    <Button onClick={() => form.reset()}>
                      {t('discard.confirm')}
                    </Button>
                  </DialogClose>
                }
              >
                {t('discard.description')}
              </DiscardChangesDialogContent>
            </DiscardChangesDialog>
          ) : (
            <DialogClose asChild>
              <Button variant="ghost" onClick={() => form.reset()}>
                {t('cancel')}
              </Button>
            </DialogClose>
          )}
          <Button onClick={form.handleSubmit(onSubmit)} className="gap-2">
            {t('save')} <Save size="1rem" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// onClick={() => setIsOpen(false)}
