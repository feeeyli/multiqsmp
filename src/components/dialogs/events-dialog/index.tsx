// Libs Imports
import { useTranslations } from 'next-intl';

// Components Imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { EventResponse } from '@/@types/globals';
import { Fragment, useEffect, useState } from 'react';
import { Event } from './event';
import { Separator } from '@/components/ui/separator';
import Countdown from 'react-countdown';

export function EventsDialog() {
  const t = useTranslations('events-dialog');

  const [events, setEvents] = useState<EventResponse[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/events', {
        next: { revalidate: 600000 },
      }).then((res) => res.json());

      setEvents(response);
    })();
  }, []);

  const futureEvents = events
    .filter((event) => {
      const now = new Date().getTime();
      const eventEnd = new Date(event.end).getTime();

      return now < eventEnd;
    })
    .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-3" size="sm">
          <Calendar size="1rem" className="block text-primary-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        {events.length > 0 && (
          <ul className="flex flex-col items-center gap-5">
            <div className="flex flex-col items-center">
              <span>{t('next-event')}</span>
              <div className="mb-2 text-3xl font-bold text-primary">
                <Countdown date={futureEvents[0].start}>
                  <span className="text-[#22c55e]">{t('event-started')}</span>
                </Countdown>
              </div>
              <Event event={futureEvents[0]} next />
            </div>
            <Separator />
            {futureEvents.map((event, i) => {
              if (i === 0) return null;

              return <Event event={event} key={event.name} />;
            })}
          </ul>
        )}
        {events.length === 0 && (
          <span className="my-4 block text-center">{t('no-events')}</span>
        )}
      </DialogContent>
    </Dialog>
  );
}
