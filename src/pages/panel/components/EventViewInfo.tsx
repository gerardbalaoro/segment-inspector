import { Button } from '@components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { ClockIcon, CopyIcon, InfoIcon, MessageSquareIcon } from 'lucide-react';
import { When } from 'react-if';
import { SegmentEvent } from '../../../shared/segment';

import { clipboard, cn } from '@src/shared/utils/ui';
import { alphabetical, crush, listify, pick, title } from 'radash';

class Info {
  static CompactList({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
      <Table className={cn('flex flex-col gap-2', className)} {...props}>
        {children}
      </Table>
    );
  }

  static CompactListItem({ title, body }: { title: JSX.Element | string; body: JSX.Element | string }) {
    return (
      <TableRow className="flex items-center border-none hover:bg-transparent">
        <TableHead className="h-auto pl-0 border-none">{title}</TableHead>
        <TableRow className="pr-0 break-all border-none hover:bg-transparent">{body}</TableRow>
      </TableRow>
    );
  }

  static List({ children, title }: React.HTMLAttributes<HTMLElement> & { title: string }) {
    return (
      <Table className="flex flex-col overflow-hidden border-none">
        <TableHeader className="py-2 border rounded-t bg-slate-100 dark:bg-slate-800 dark:text-white dark:border-slate-500">
          <TableHead
            className={cn('flex h-auto items-center gap-4', 'text-xs font-semibold uppercase tracking-wide')}
            colSpan={2}
          >
            {title}
          </TableHead>
        </TableHeader>
        <TableBody className="border rounded-b dark:border-slate-500">{children}</TableBody>
      </Table>
    );
  }

  static ListItem({ title, body }: { title: JSX.Element | string; body: unknown }) {
    return (
      <TableRow className="flex flex-col w-full gap-0 p-2 px-4 overflow-hidden lg:table-row lg:p-0 dark:border-slate-500">
        <TableCell
          className={cn(
            'whitespace-nowrap p-0 text-xs font-medium text-primary-500 lg:text-current',
            'lg:py-2 lg:px-4 lg:text-md font-mono',
          )}
        >
          {title}
        </TableCell>
        <TableCell
          className={cn('relative w-full p-0 break-all lg:py-2 lg:px-4', body && 'group hover:pr-8 lg:hover:pr-12')}
        >
          <div>{body ? body.toString() : <code className="text-xs">null</code>}</div>
          <When condition={!!body}>
            <div className="absolute top-0 bottom-0 right-0 items-center hidden h-full lg:mr-4 group-hover:flex">
              <Button
                variant="ghost"
                size="icon"
                title="Copy"
                className="w-6 h-6 text-primary-500 hover:text-primary-500 hover:bg-primary-100"
                onClick={() => clipboard(body.toString())}
              >
                <CopyIcon className="w-3 h-3" />
              </Button>
            </div>
          </When>
        </TableCell>
      </TableRow>
    );
  }
}

export default function EventViewInfo({ event }: { event: SegmentEvent }) {
  type Property = { key: string; value: unknown };

  const filter = (properties: Property[]) => {
    return properties.filter(({ value }) => typeof value !== 'undefined');
  };

  const traits = alphabetical(
    listify(crush(event.data.traits), (key, value) => ({
      key,
      value,
    })) as Property[],
    i => i.key.toString(),
  );

  const properties = alphabetical(
    listify(crush(event.properties), (key, value) => ({
      key,
      value,
    })) as Property[],
    i => i.key.toString(),
  );

  const page = filter(
    listify(pick(event.data, ['name', 'category']) as Record<string, unknown>, (key, value) => ({ key, value })),
  );

  return (
    <div className="flex flex-col gap-4 p-4 text-sm">
      <Info.CompactList>
        <Info.CompactListItem title={<InfoIcon type={event.type} className="w-4 h-4" />} body={title(event.type)} />
        <Info.CompactListItem title={<MessageSquareIcon className="w-4 h-4" />} body={event.id} />
        <Info.CompactListItem
          title={<ClockIcon className="w-4 h-4" />}
          body={
            <>
              <span className="hidden xs:block">{event.timestamp.format('llll')}</span>
              <span className="block xs:hidden">{event.timestamp.format('lll')}</span>
            </>
          }
        />
      </Info.CompactList>

      <Info.List title="Common">
        <When condition={event.type === 'track'}>
          <Info.ListItem title="Event" body={event.data.event} />
        </When>
        <Info.ListItem title="Anonymous ID" body={event.anonymousId} />
        <Info.ListItem title="User ID" body={event.userId} />
        <When condition={event.type === 'alias'}>
          <Info.ListItem title="Previous ID" body={event.data.previousId} />
        </When>
      </Info.List>

      <When condition={event.type === 'identify' && traits.length > 0}>
        <Info.List title="User Traits">
          {traits.map(({ key, value }) => (
            <Info.ListItem key={key} title={key} body={value} />
          ))}
        </Info.List>
      </When>

      <When condition={event.type === 'page' && page.length > 0}>
        <Info.List title="Page">
          {page.map(({ key, value }) => (
            <Info.ListItem key={key} title={key} body={value} />
          ))}
        </Info.List>
      </When>

      <When condition={properties.length > 0}>
        <Info.List title="Properties">
          {properties.map(({ key, value }) => (
            <Info.ListItem key={key} title={key} body={value} />
          ))}
        </Info.List>
      </When>
    </div>
  );
}
