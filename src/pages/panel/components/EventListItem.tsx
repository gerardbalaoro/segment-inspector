/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, { useEffect, useState } from 'react';
import { SegmentEvent } from '../../../shared/segment';
import EventTypeIcon from './EventTypeIcon';

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
  isActive?: boolean;
  onClick?: (event: SegmentEvent) => void;
};

export const EventListItem: React.FC<Props> = ({ event, isActive, onClick }) => {
  const [timestamp, setTimestamp] = useState(event.timestamp.fromNow());
  const hasError = event.data._request?.completed_at && event.data._request?.response !== 200;

  const handleClick: React.MouseEventHandler = e => {
    e.preventDefault();
    if (typeof onClick === 'function') {
      onClick(event);
    }
  };

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
        'flex flex-wrap grid-rows-2 flex-shrink-0 gap-1 items-center px-4 py-2',
        'cursor-pointer text-sm overflow-hidden w-full border-y -mt-px',
        !isActive && !hasError && ['hover:bg-slate-50 dark:border-slate-500 dark:hover:bg-slate-800'],
        !isActive &&
          hasError && [
            'border-yellow-500 bg-yellow-200 bg-opacity-25 text-yellow-800 z-[1]',
            'hover:border-orange-500 hover:bg-orange-50 text-orange-800',
            'dark:border-yellow-500 dark:hover:bg-yellow-800 dark:text-yellow-100',
            'dark:hover:border-orange-500 dark:!bg-orange-500 dark:!bg-opacity-25 dark:text-orange-100',
          ],
        isActive &&
          hasError && [
            'border-red-500 !bg-red-200 !bg-opacity-25 text-red-800 z-[1]',
            'dark:border-red-500 dark:!bg-red-500 dark:!bg-opacity-25 dark:text-red-100',
          ],
        isActive &&
          !hasError && [
            'border-primary-500 !bg-primary-200 !bg-opacity-25 text-primary-800 z-[2]',
            'dark:border-primary-500 dark:!bg-primary-500 dark:!bg-opacity-25 dark:text-primary-100',
          ],
      )}
      onClick={handleClick}
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
