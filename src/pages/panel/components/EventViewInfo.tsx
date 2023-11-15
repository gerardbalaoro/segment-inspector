// import { SegmentEvent } from '../lib/segment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { ClockIcon, FingerprintIcon, TagIcon } from 'lucide-react';
import { When } from 'react-if';
import { SegmentEvent } from '../../../shared/segment';

import { cn } from '@src/shared/utils/ui';
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
        <TableHead className="h-auto border-none pl-0">{title}</TableHead>
        <TableRow className="break-all border-none pr-0 hover:bg-transparent">{body}</TableRow>
      </TableRow>
    );
  }

  static List({ children, title }: React.HTMLAttributes<HTMLElement> & { title: string }) {
    return (
      <Table className="flex flex-col border-none">
        <TableHeader className="rounded-t border bg-slate-100 py-2 dark:bg-slate-800 dark:text-white dark:border-slate-500">
          <TableHead
            className={cn('flex h-auto items-center gap-4', 'text-xs font-semibold uppercase tracking-wide')}
            colSpan={2}
          >
            {title}
          </TableHead>
        </TableHeader>
        <TableBody className="rounded-b border dark:border-slate-500">{children}</TableBody>
      </Table>
    );
  }

  static ListItem({ title, body }: { title: JSX.Element | string; body: unknown }) {
    return (
      <TableRow className="flex w-full flex-col gap-0 p-2 sm:table-row sm:p-0 dark:border-slate-500">
        <TableCell
          className={cn(
            'whitespace-nowrap p-0 text-xs font-medium text-primary-500 sm:text-current',
            'sm:p-2 sm:text-sm font-mono',
          )}
        >
          {title}
        </TableCell>
        <TableCell className="w-full break-all p-0 sm:p-2">
          {body ? body.toString() : <code className="text-xs">null</code>}
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
        <Info.CompactListItem title={<TagIcon className="h-4 w-4" />} body={title(event.type)} />
        <Info.CompactListItem title={<FingerprintIcon className="h-4 w-4" />} body={event.id} />
        <Info.CompactListItem
          title={<ClockIcon className="h-4 w-4" />}
          body={
            <>
              <span className="hidden xs:block">{event.timestamp.format('llll')}</span>
              <span className="block xs:hidden">{event.timestamp.format('lll')}</span>
            </>
          }
        />
      </Info.CompactList>

      <Info.List title="Identity">
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
