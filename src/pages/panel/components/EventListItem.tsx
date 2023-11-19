/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, { useEffect, useState } from 'react';
import { SegmentEvent } from '../../../shared/segment';
import EventTypeIcon from './EventTypeIcon';

import useEventStore from '@root/src/shared/hooks/useEventStore';
import { cn } from '@src/shared/utils/ui';

dayjs.extend(updateLocale);
dayjs.extend(relativeTime, {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'ss', r: 59, d: 'second' },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 29, d: 'day' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 1 },
    { l: 'yy', d: 'year' },
  ],
});
dayjs.updateLocale('en', {
  relativeTime: {
    ...dayjs.Ls.en.relativeTime,
    ss: '%d seconds',
  },
});

type Props = {
  event: SegmentEvent;
};

export const EventListItem: React.FC<Props> = ({ event }) => {
  const { open, close, active } = useEventStore();
  const [timestamp, setTimestamp] = useState(event.timestamp.fromNow());

  const isActive = active.id === event.id;

  useEffect(() => {
    let frame = null;
    const update = () => {
      if (event.timestamp > dayjs().subtract(1, 'minute')) {
        setTimestamp(event.timestamp.fromNow());
        frame = requestAnimationFrame(update);
      } else {
        setTimestamp(event.timestamp.format('YYYY-MM-DD LTS'));
      }
    };

    frame = requestAnimationFrame(update);

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [event]);

  return (
    <li
      className={cn(
        'flex flex-wrap grid-rows-2 flex-shrink-0 cursor-pointer gap-1 items-center border-b px-4 py-2 text-sm overflow-hidden w-full',
        'hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-800',
        isActive && ['bg-primary-500 text-white hover:bg-primary-500', 'dark:bg-primary-600 dark:hover:bg-primary-600'],
      )}
      onClick={() => (isActive ? close() : open(event.id))}
    >
      <p className="flex items-center gap-2 mx-0 min-w-auto xs:min-w-20">
        <EventTypeIcon type={event.type} className="w-4 h-4" />
        <span className="hidden text-xs font-medium tracking-wide uppercase xs:block">{event.type}</span>
      </p>
      <p className="flex-shrink-0 ml-auto mr-0 text-xs whitespace-nowrap">{timestamp}</p>
      <p className="w-full min-w-0 ml-0 mr-auto truncate">
        <code className="font-mono font-semibold">{event.name}</code>
      </p>
    </li>
  );
};

export default EventListItem;
