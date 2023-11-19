import { ScrollArea } from '@components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { SegmentEvent } from '../../../shared/segment';
import EventViewInfo from './EventViewInfo';
import EventViewJson from './EventViewJson';

export default function EventView({ event }: { event?: SegmentEvent }) {
  const pages = [
    { id: 'info', title: 'Overview', content: EventViewInfo },
    { id: 'json', title: 'Raw', content: EventViewJson },
  ];

  if (!event) {
    return <div className="flex items-center justify-center w-full h-full">No Event Selected</div>;
  }

  return (
    <Tabs defaultValue={pages[0]?.id} className="flex flex-col w-full h-full overflow-hidden">
      <TabsList className="sticky justify-start flex-shrink-0 w-full h-auto p-0 overflow-hidden border-b rounded-none shadow-sm dark:border-slate-500">
        {pages.map(p => (
          <TabsTrigger
            value={p.id}
            key={p.id}
            className="
                rounded-none border-y-2 border-transparent !bg-transparent
                px-4 !shadow-none data-[state=active]:border-b-primary-500
            "
          >
            {p.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {pages.map(p => (
        <TabsContent value={p.id} key={p.id} className="m-0 overflow-auto">
          <ScrollArea className="h-full">
            <p.content event={event} />
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}
