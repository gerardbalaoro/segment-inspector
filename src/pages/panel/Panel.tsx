import logo from '@assets/img/icon.svg';
import '@assets/style/theme.css';
import '@pages/panel/Panel.css';
import React, { useEffect } from 'react';
import EventList from './components/EventList';

import { When } from 'react-if';
import { SegmentEvent } from '../../shared/segment';
import EventView from './components/EventView';
import { onRequest } from './lib/network-events';

import useEventStore from '@root/src/shared/hooks/useEventStore';
import useTheme from '@src/shared/hooks/useTheme';
import { cn } from '@src/shared/utils/ui';
import ActionBar from './components/ActionBar';

const Panel: React.FC = () => {
  const theme = useTheme();
  const { events, active, add } = useEventStore();

  useEffect(() => {
    document.body.classList.toggle('dark', theme.isDarkMode);
  }, [theme.isDarkMode]);

  useEffect(() => {
    onRequest(({ request }) => {
      const url = new URL(request.url);

      if (url.host !== 'api.segment.io' || request.method !== 'POST') {
        return;
      }

      const content = JSON.parse(request.postData.text);
      const event = new SegmentEvent(content);

      if (event.name) {
        add(event);
      }
    });
  }, [add]);

  return (
    <>
      <header className="flex items-center justify-between border-b px-4 py-2 shadow-sm dark:border-slate-500">
        <div className="flex items-center gap-3">
          <img src={logo} className="block h-6 w-auto" alt="Segment logo" />
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">
            Segment<span className="hidden xs:inline"> Inspector</span>
          </h1>
        </div>
        <ActionBar />
      </header>
      <main className="m-0 flex h-full w-full flex-col overflow-hidden md:flex-row">
        <section className="h-full w-full overflow-hidden">
          <EventList events={events} />
        </section>
        <div className="h-px w-full bg-slate-200 dark:bg-slate-500 md:h-full md:w-px"></div>
        <When condition={!!active}>
          <section className={cn('h-1/2 w-full flex-shrink-0 flex-grow md:h-full md:w-1/2 lg:w-3/5 xl:w-3/4')}>
            <EventView event={active} />
          </section>
        </When>
      </main>
    </>
  );
};

export default Panel;
