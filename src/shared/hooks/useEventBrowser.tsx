import dayjs from 'dayjs';
import { sort } from 'radash';
import { useEffect, useMemo, useState } from 'react';
import { devtools } from 'webextension-polyfill';
import { SegmentEvent, SegmentEventData } from '../segment';
import storage from '../storages/event';

export default function useEventBrowser() {
  const key = devtools.inspectedWindow.tabId.toString();
  const [events, setEvents] = useState<SegmentEventData[]>([]);
  const [messageId, setMessageId] = useState<string | null>(null);

  const active = useMemo<SegmentEventData | null>(() => {
    const event = messageId ? events.find(e => e.messageId === messageId) : null;

    return event ?? null;
  }, [events, messageId]);

  const setReponse = (id: string, timestamp: string, code: number, error?: string) => {
    setEvents(events => {
      for (const event of events) {
        if (event._request?.id === id) {
          event._request.completed_at = dayjs(timestamp).toISOString();
          event._request.response = code;
          event._request.error = error;
        }
      }

      return events;
    });
  };

  useEffect(() => {
    storage.get(key).then(events => {
      setEvents(events);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    storage.set(key, events);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

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
