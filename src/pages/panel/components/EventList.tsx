import { ScrollArea } from '@components/ui/scroll-area';
import { SegmentEvent } from '@src/shared/segment';
import EventListItem from './EventListItem';

type Props = {
  events: SegmentEvent[];
  active: SegmentEvent | null;
  onEventClick: (event: SegmentEvent) => void;
};

export default function EventList({ events, active, onEventClick }: Props) {
  return (
    <ScrollArea className="w-full h-full overflow-auto">
      <ul className="flex flex-col w-full h-full">
        {events.map(e => (
          <EventListItem key={e.id} event={e} isActive={e.id === active?.id} onClick={onEventClick} />
        ))}
      </ul>
    </ScrollArea>
  );
}
