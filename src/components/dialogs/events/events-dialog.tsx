import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EVENTS } from '@/data/events';
import { useTranslations } from '@/hooks/useTranslations';
import { Calendar } from 'lucide-react';
import Countdown from 'react-countdown';
import { Event } from './event';

function addHours(date: Date, hours: number) {
  const added = new Date(date);

  added.setHours(added.getHours() + hours);

  return added;
}

export function EventsDialog() {
  const t = useTranslations('events-dialog');

  const futureEvents = EVENTS.filter((event) => {
    const now = new Date().getTime();
    const eventEnd = addHours(event.time, 2).getTime();

    return now < eventEnd;
  }).sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-3" size="sm">
          <Calendar size="1rem" className="block text-secondary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        {futureEvents.length > 0 && (
          <ul className="flex max-h-[80dvh] flex-col items-center">
            <div className="flex flex-col items-center">
              <span>{t('next-event')}</span>
              <div className="mb-2 text-3xl font-bold text-primary">
                <Countdown
                  date={futureEvents[0].time}
                  renderer={({ days, hours, minutes, seconds }) => {
                    return (
                      <span>
                        {days > 0 && days + 'd'} {hours}h {minutes}m {seconds}s
                      </span>
                    );
                  }}
                >
                  <span className="text-[#22c55e]">{t('event-started')}</span>
                </Countdown>
              </div>
            </div>
            <Accordion
              type="single"
              className="w-full overflow-y-auto scrollbar"
              defaultValue={futureEvents[0].name}
            >
              {futureEvents.map((event) => {
                return <Event event={event} key={event.name} />;
              })}
            </Accordion>
          </ul>
        )}
        {futureEvents.length === 0 && (
          <span className="my-4 block text-center">{t('no-events')}</span>
        )}
      </DialogContent>
    </Dialog>
  );
}
