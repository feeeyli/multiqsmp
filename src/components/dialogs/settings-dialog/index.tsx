'use client';

// Libs Imports
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Icons Imports
import { Save, Settings } from 'lucide-react';

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
import { useTheme } from 'next-themes';
import { DialogClose } from '@radix-ui/react-dialog';
import { useState } from 'react';

const settingsFormSchema = z.object({
  appearance: z.object({
    theme: z.enum(['default-dark', 'default-light', 'gray-dark', 'gray-light']),
    streamersAvatar: z.enum(['twitch', 'skin', 'both']),
    streamStatus: z.object({
      offline: z.boolean(),
      noPlaying: z.boolean(),
    }),
  }),
  streams: z.object({
    alwaysShowHeader: z.boolean(),
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
  const { setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  function onSubmit(values: SettingsType) {
    setSettings(values);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button className="mt-4 rounded-r-none px-3" size="sm">
          <Settings size="1rem" className="block text-primary-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8">
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
                          <SelectItem value="default-dark">
                            {t('form.appearance.theme.default-dark')}
                          </SelectItem>
                          <SelectItem value="default-light">
                            {t('form.appearance.theme.default-light')}
                          </SelectItem>
                          <SelectItem value="gray-dark">
                            {t('form.appearance.theme.gray-dark')}
                          </SelectItem>
                          <SelectItem value="gray-light">
                            {t('form.appearance.theme.gray-light')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appearance.streamersAvatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('form.appearance.streams-avatar.label')}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                'form.appearance.streams-avatar.label',
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="twitch">
                            {t('form.appearance.streams-avatar.twitch')}
                          </SelectItem>
                          <SelectItem value="skin">
                            {t('form.appearance.streams-avatar.skin')}
                          </SelectItem>
                          <SelectItem value="both">
                            {t('form.appearance.streams-avatar.both')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-3">
                  <span className="text-sm">
                    {t('form.appearance.streams-status.label')}
                  </span>
                  <FormField
                    control={form.control}
                    name="appearance.streamStatus.offline"
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
                              {t('form.appearance.streams-status.offline')}
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        </label>
                      </Button>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="appearance.streamStatus.noPlaying"
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
                              {t('form.appearance.streams-status.noPlaying')}
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
                <span className="text-sm">
                  {t('form.streams.general.label')}
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
                            {t('form.streams.general.always-show-header')}
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      </label>
                    </Button>
                  )}
                />
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
                            {t('form.streams.general.start-muted')}
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
        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            variant="ghost"
            className="gap-2"
          >
            {t('save')} <Save size="1rem" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
