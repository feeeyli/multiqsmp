import { EventType } from '@/@types/data';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Announcement } from './announcement';

interface EventProps {
  event: EventType;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Event = (props: EventProps) => {
  return (
    <AccordionItem
      className="flex w-full flex-col items-center opacity-70 data-[state=open]:opacity-100"
      value={props.event.name}
    >
      <AccordionTrigger className="-mr-7 gap-3 hover:no-underline [&_span]:hover:underline">
        <div className="flex flex-col items-center">
          <span className="text-center text-2xl font-bold text-primary">
            {props.event.name}
          </span>
          <time className="block">
            {capitalizeFirstLetter(
              new Date(props.event.time).toLocaleString(undefined, {
                weekday: 'long',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZoneName: 'short',
              }),
            )}
          </time>
        </div>
      </AccordionTrigger>
      <AccordionContent className="w-full max-w-[22rem] overflow-visible overflow-y-clip text-foreground [&>div]:p-0">
        <Carousel
          className="w-full max-w-[22rem] cursor-move pb-12 active:cursor-grabbing sm:pb-4"
          opts={{
            align: 'start',
          }}
        >
          <CarouselContent className="">
            {props.event.announcements.map((ann) => (
              <Announcement key={ann.pictures[0]} announcement={ann} />
            ))}
          </CarouselContent>
          {props.event.announcements.length > 0 && (
            <>
              <CarouselNext className="-bottom-2 right-0 top-[unset] sm:-right-12 sm:bottom-[unset] sm:top-1/2" />
              <CarouselPrevious className="-bottom-2 left-0 top-[unset] sm:-left-12 sm:bottom-[unset] sm:top-1/2" />
            </>
          )}
        </Carousel>
      </AccordionContent>
    </AccordionItem>
  );
};
/*
-bottom-2 right-0 top-[unset] sm:bottom-auto sm:right-auto
-bottom-2 left-0 top-[unset] sm:bottom-[unset] sm:left-[unset]
*/
