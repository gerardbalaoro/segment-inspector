import dayjs from 'dayjs';
import { sort } from 'radash';
import { useMemo, useState } from 'react';
import { SegmentEvent, SegmentEventData } from '../segment';
import { type ResponseMessage } from '../types';

export default function useEventBrowser() {
  const [events, setEvents] = useState<SegmentEventData[]>([]);
  const [messageId, setMessageId] = useState<string | null>(null);

  const active = useMemo<SegmentEventData | null>(() => {
    const event = messageId ? events.find(e => e.messageId === messageId) : null;

    return event ?? null;
  }, [events, messageId]);

  const setReponse = (id: string, response: ResponseMessage) => {
    setEvents(events => {
      for (const event of events) {
        if (event._request?.id === id) {
          event._request.completed_at = response.timestamp;
          event._request.response = response.code;
          event._request.error = response.error;
        }
      }

      return events;
    });
  };

  return {
    list: sort(events, e => dayjs(e.timestamp).unix(), true),
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
    setReponse,
  };
}
