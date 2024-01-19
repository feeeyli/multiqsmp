import { EventResponse } from '@/@types/globals';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface EventProps {
  past?: boolean;
  next?: boolean;
  event: EventResponse;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Event = (props: EventProps) => {
  return (
    <li
      className="flex flex-col items-center opacity-70 data-[next=true]:opacity-100"
      data-next={props.next || props.past}
    >
      <Link
        href={props.event.announcements[0] || 'https://x.com/QuackityStudios'}
        target="_blank"
        className="flex items-center gap-2 text-center text-2xl font-bold text-primary data-[past=true]:text-muted-foreground"
      >
        <h3 data-past={props.past}>{props.event.name}</h3>
        <ExternalLink size="1.25rem" />
      </Link>
      <span className="block">
        {capitalizeFirstLetter(
          new Date(props.event.start).toLocaleString(undefined, {
            weekday: 'long',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
          }),
        )}
      </span>
    </li>
  );
};
