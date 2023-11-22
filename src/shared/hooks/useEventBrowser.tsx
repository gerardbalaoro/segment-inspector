import { useMemo, useState } from 'react';
import { SegmentEvent, SegmentEventData } from '../segment';

export default function useEventBrowser() {
  const [events, setEvents] = useState<SegmentEventData[]>([]);
  const [messageId, setMessageId] = useState<string | null>(null);

  const active = useMemo<SegmentEventData | null>(() => {
    const event = messageId ? events.find(e => e.messageId === messageId) : null;

    return event ?? null;
  }, [events, messageId]);

  return {
    list: events,
    active,
    add: (event: SegmentEventData) => {
      setEvents(events => {
        if (SegmentEvent.validate(event)) {
          const existing = events.find(e => e.messageId === event.messageId);
          if (typeof existing === 'undefined') {
            return [event, ...events];
          }
        }
        return events;
      });
    },
    open: (id: string) => setMessageId(id),
    close: () => setMessageId(null),
    clear: () => setEvents([]),
  };
}
