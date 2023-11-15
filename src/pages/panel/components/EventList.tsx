import { ScrollArea } from '@components/ui/scroll-area';
import { SegmentEvent } from '@src/shared/segment';
import EventListItem from './EventListItem';

export default function EventList({ events }: { events: SegmentEvent[] }) {
  return (
    <ScrollArea className="w-full h-full overflow-auto">
      <ul className="flex h-full w-full flex-col">
        {events.map(e => (
          <EventListItem key={e.id} event={e} />
        ))}
      </ul>
    </ScrollArea>
  );
}
