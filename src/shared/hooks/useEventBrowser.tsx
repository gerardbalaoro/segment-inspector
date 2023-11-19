import { useMemo, useState } from 'react';
import { SegmentEventData } from '../segment';

export default function useEventBrowser() {
  const [events, setEvents] = useState<SegmentEventData[]>([]);
  const [messageId, setMessageId] = useState<string | null>(null);

  const active = useMemo<SegmentEventData | null>(() => {
    let event = events[0];

    if (messageId) {
      event = events.find(e => e.messageId === messageId);
    }

    return event ?? null;
  }, [events, messageId]);

  return {
    list: events,
    active,
    add: (event: SegmentEventData) => {
      setEvents(events => {
        const existing = events.find(e => e.messageId === event.messageId);
        if (typeof existing === 'undefined') {
          return [event, ...events];
        }
        return events;
      });
    },
    open: (id: string) => setMessageId(id),
    close: () => setMessageId(null),
    clear: () => setEvents([]),
  };
}
