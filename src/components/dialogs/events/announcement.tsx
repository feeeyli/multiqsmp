/* eslint-disable @next/next/no-img-element */
import { EventAnnouncement } from '@/@types/data';
import { Button } from '@/components/ui/button';
import { CarouselItem } from '@/components/ui/carousel';
import { cva } from 'class-variance-authority';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';

const imagesContainerVariants = cva(
  'grid aspect-[344/236.8] w-full grid-cols-2 grid-rows-2 gap-2',
  {
    variants: {
      images: {
        1: '[&>a]:row-span-2 [&>a]:col-span-2',
        2: '[&>a]:row-span-2',
        3: 'even:[&>a]:row-span-2',
        4: '',
      },
    },
  },
);

export function Announcement(props: { announcement: EventAnnouncement }) {
  return (
    <CarouselItem className="w-full">
      <article className="flex h-80 flex-col gap-3 overflow-y-auto rounded-md border border-border px-4 py-3 text-foreground scrollbar">
        <header className="grid grid-cols-2 gap-2">
          <Link
            href={
              'https://twitter.com/' + props.announcement.publisher.username
            }
            target="_blank"
            className="flex items-center gap-2"
          >
            <Image
              alt="profile"
              width={40}
              height={40}
              src={props.announcement.publisher.picture}
              className="aspect-square w-[2.625rem] rounded-full"
            />
            <section className="mb-[2px] flex flex-col text-sm">
              <span className="font-bold hover:underline">
                {props.announcement.publisher.name}
              </span>
              <span className="font-normal text-muted-foreground">
                @{props.announcement.publisher.username}
              </span>
            </section>
          </Link>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="my-auto ml-auto h-9 w-9"
          >
            <Link href={props.announcement.link} target="_blank">
              <ExternalLink size="1rem" className="text-primary" />
            </Link>
          </Button>
        </header>
        <Markdown
          className="whitespace-pre-line text-sm "
          components={{
            em({ children }) {
              return (
                <Link
                  href={
                    'https://twitter.com/hashtag/' + String(children).slice(1)
                  }
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  {children}
                </Link>
              );
            },
          }}
        >
          {props.announcement.text}
        </Markdown>
        {props.announcement.pictures.length > 0 && (
          <section
            className={imagesContainerVariants({
              images: props.announcement.pictures.length as 1 | 2 | 3 | 4,
            })}
          >
            {props.announcement.pictures.map((pic) => (
              <Link href={props.announcement.link} target="_blank" key={pic}>
                <img
                  alt="image-1"
                  width={254}
                  height={254 / 1.59}
                  src={pic}
                  className="h-full w-full rounded-md border border-border object-cover"
                />
              </Link>
            ))}
          </section>
        )}
      </article>
    </CarouselItem>
  );
}
