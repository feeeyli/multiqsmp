'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SKIN_HEADS } from '@/data/skinHeads';
import { STREAMERS } from '@/data/streamers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Files, Minus, RotateCcw, Shapes } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCopyToClipboard } from 'usehooks-ts';
import * as z from 'zod';

const STREAMERS_TEMPLATE = `export const PURGATORY_STREAMERS = ((PS));

export const STREAMERS = ((S));`;

const formSchema = z.object({
  displayName: z.string(),
  twitchName: z.string(),
  avatarUrl: z.string(),
  skinHead: z.string(),
});

export default function AddStreamer() {
  const [, copy] = useCopyToClipboard();
  const [added, setAdded] = useState<z.infer<typeof formSchema>[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setAdded((old) => [...old, data]);
    form.reset({
      twitchName: '',
      displayName: '',
      avatarUrl: '',
      skinHead: '',
    });
  }

  return (
    <main className="flex h-dvh w-full items-center justify-center">
      <div className="max flex w-[90%] max-w-96 flex-col">
        <h1 className="mb-4 text-xl font-bold">Add streamer</h1>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Display Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitch Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Twitch Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Avatar URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skinHead"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skin Head</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Skin Head" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2 self-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setAdded([]);
                  form.reset({
                    twitchName: '',
                    displayName: '',
                    avatarUrl: '',
                    skinHead: '',
                  });
                }}
                type="button"
              >
                <RotateCcw size="1rem" />
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
        {added.length > 0 && (
          <div className="mt-4">
            <h2 className="mb-2 flex w-full items-center justify-center gap-3">
              Added
              <Button
                variant="ghost"
                size="sm"
                className="active:bg-muted/60"
                onClick={() => {
                  copy(
                    STREAMERS_TEMPLATE.replace(
                      '((S))',
                      JSON.stringify(
                        [
                          ...STREAMERS,
                          ...added.map((a) => ({
                            displayName: a.displayName,
                            twitchName: a.twitchName,
                            avatarUrl: a.avatarUrl,
                          })),
                        ],
                        null,
                        2,
                      ),
                    ),
                  );
                }}
              >
                <Files size="1rem" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="active:bg-muted/60"
                onClick={() => {
                  copy(
                    'export const SKIN_HEADS = ((SH));'.replace(
                      '((SH))',
                      JSON.stringify(
                        (() => {
                          const r = { ...SKIN_HEADS } as {
                            [name: string]: string;
                          };

                          added.forEach((a) => {
                            r[
                              a.twitchName
                            ] = `https://s.namemc.com/2d/skin/face.png?id=${a.skinHead}&scale=32`;
                          });

                          return r;
                        })(),
                        null,
                        2,
                      ),
                    ),
                  );
                }}
              >
                <Shapes size="1rem" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="active:bg-muted/60"
                onClick={() => {
                  setAdded((old) => old.slice(0, -1));
                }}
              >
                <Minus size="1rem" />
              </Button>
            </h2>
            <pre className="w-full text-wrap text-center text-sm">
              {JSON.stringify(added.map((a) => a.displayName))}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
