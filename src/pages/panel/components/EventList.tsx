import { ScrollArea } from '@components/ui/scroll-area';
import useEventStore from '@root/src/shared/hooks/useEventStore';
import EventListItem from './EventListItem';

export default function EventList() {
  const { events } = useEventStore();

  return (
    <ScrollArea className="w-full h-full overflow-auto">
      <ul className="flex flex-col w-full h-full">
        {events.map(e => (
          <EventListItem key={e.id} event={e} />
        ))}
      </ul>
    </ScrollArea>
  );
}
