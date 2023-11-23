import logo from '@assets/img/icon.svg';
import '@assets/style/theme.css';
import '@pages/panel/Panel.css';
import React, { useEffect } from 'react';
import EventList from './components/EventList';

import { When } from 'react-if';
import EventView from './components/EventView';

import { SegmentEvent } from '@root/src/shared/segment';
import { RequestMessage, ResponseMessage } from '@root/src/shared/types';
import useEventBrowser from '@src/shared/hooks/useEventBrowser';
import useTheme from '@src/shared/hooks/useTheme';
import { cn } from '@src/shared/utils/ui';
import { minimatch } from 'minimatch';
import browser from 'webextension-polyfill';
import { z } from 'zod';
import ActionBar from './components/ActionBar';

const Panel: React.FC = () => {
  const id = browser.devtools.inspectedWindow.tabId;
  const eventBrowser = useEventBrowser();
  const theme = useTheme();

  const events = eventBrowser.list.map(e => new SegmentEvent(e));
  const active = eventBrowser.active ? new SegmentEvent(eventBrowser.active) : null;
  const preview = (event: SegmentEvent) => {
    if (eventBrowser.active?.messageId === event.id) {
      eventBrowser.close();
    } else {
      eventBrowser.open(event.id);
    }
  };

  const handlers = {
    'request:sent': (data: unknown) => {
      const patterns = ['https://*api.segment.io/v1/*'];
      const Request = RequestMessage.extend({
        method: z.literal('POST'),
        tabId: z.literal(id),
      });

      const request = Request.safeParse(data);

      if (!request.success) {
        return;
      }

      try {
        const { url, body, id } = request.data;
        if (patterns.some(pattern => minimatch(url, pattern))) {
          const event = JSON.parse(body);
          eventBrowser.add({ ...event, _request: { id } });
        }
      } catch (e) {
        console.error(e);
      }
    },
    'request:complete': (data: unknown) => {
      const Response = ResponseMessage.extend({
        tabId: z.literal(id),
      });

      const response = Response.safeParse(data);

      if (response.success) {
        const id = response.data.id;
        eventBrowser.setReponse(id, response.data);
      }
    },
  };

  const listener = (message: Record<string, unknown>) => {
    if (
      typeof message !== 'object' ||
      typeof message.event !== 'string' ||
      typeof handlers[message.event] !== 'function'
    ) {
      return;
    }
    handlers[message.event](message.data);
  };

  useEffect(() => {
    document.body.classList.toggle('dark', theme.isDarkMode);
  }, [theme.isDarkMode]);

  useEffect(() => {
    const background = browser.runtime.connect({ name: `devtools-${id}` });

    if (!background.onMessage.hasListener(listener)) {
      background.onMessage.addListener(listener);
      console.log('[Panel] Connected to background script');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 border-b shadow-sm dark:border-slate-500">
        <div className="flex items-center gap-3">
          <img src={logo} className="block w-auto h-6" alt="Segment logo" />
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">
            Segment<span className="hidden xs:inline"> Inspector</span>
          </h1>
        </div>
        <ActionBar onClearEvents={eventBrowser.clear} />
      </header>
      <main className="flex flex-col w-full h-full m-0 overflow-hidden md:flex-row">
        <section className="w-full h-full overflow-hidden">
          <EventList events={events} active={active} onEventClick={preview} />
        </section>
        <When condition={!!active}>
          <div className="z-10 w-full h-px bg-slate-200 dark:bg-slate-500 md:h-full md:w-px"></div>
          <section className={cn('h-1/2 w-full flex-shrink-0 flex-grow md:h-full md:w-1/2 lg:w-3/5')}>
            <EventView event={active} />
          </section>
        </When>
      </main>
    </>
  );
};

export default Panel;
