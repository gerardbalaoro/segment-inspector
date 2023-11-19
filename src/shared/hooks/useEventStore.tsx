import { atom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { SegmentEvent } from '../segment';

const store = {
  active: atom<string | false>(false),
  events: atom<SegmentEvent[]>([]),
};

export default function useEventStore() {
  const [events, setEvents] = useAtom(store.events);
  const [activeEvent, setActiveEvent] = useAtom(store.active);
  const active = useMemo<SegmentEvent | null>(() => {
    const event = activeEvent ? events.find(a => a.id === activeEvent) : events[0];
    return event ?? null;
  }, [events, activeEvent]);

  const add = (event: SegmentEvent) => {
    setEvents(prevEvents => {
      const existing = prevEvents.find(e => e.id === event.id);
      if (typeof existing === 'undefined') {
        return [event, ...prevEvents];
      }
      return prevEvents;
    });
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
