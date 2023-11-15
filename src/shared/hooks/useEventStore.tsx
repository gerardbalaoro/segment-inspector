import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo } from 'react';
import { SegmentEvent } from '../segment';

const store = {
  active: atom<string | false>(false),
  events: atomWithStorage<SegmentEvent[]>('events', [], {
    getItem(key: string, initialValue: SegmentEvent[]) {
      const json = localStorage.getItem(key);
      try {
        const events = JSON.parse(json ?? '');
        if (!Array.isArray(events)) {
          return initialValue;
        }
        return events.map(data => new SegmentEvent(data));
      } catch {
        return initialValue;
      }
    },
    setItem(key: string, value: SegmentEvent[]) {
      const data = value.map(event => event.data);
      localStorage.setItem(key, JSON.stringify(data));
    },
    removeItem(key: string) {
      localStorage.removeItem(key);
    },
  }),
};

export default function useEventStore() {
  const [events, setEvents] = useAtom(store.events);
  const [activeEvent, setActiveEvent] = useAtom(store.active);
  const active = useMemo<SegmentEvent | null>(() => {
    const event = activeEvent ? events.find(a => a.id === activeEvent) : events[0];
    return event ?? null;
  }, [events, activeEvent]);

  console.log(events);

  const add = (event: SegmentEvent) => {
    const existing = events.find(e => e.id === event.id);

    if (typeof existing === 'undefined') {
      setEvents([event, ...events]);
    }
  };

  return {
    events,
    active,
    add,
    open: (id: string) => setActiveEvent(id),
    close: () => setActiveEvent(null),
    clear: () => setEvents([]),
  };
}
