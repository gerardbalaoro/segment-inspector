import logo from '@assets/img/icon.svg';
import '@assets/style/theme.css';
import '@pages/panel/Panel.css';
import React, { useEffect } from 'react';
import EventList from './components/EventList';

import { When } from 'react-if';
import EventView from './components/EventView';

import { SegmentEvent } from '@root/src/shared/segment';
import { RequestDoneMessage, RequestSentMessage } from '@root/src/shared/types';
import useEventBrowser from '@src/shared/hooks/useEventBrowser';
import useTheme from '@src/shared/hooks/useTheme';
import { cn } from '@src/shared/utils/ui';
import { minimatch } from 'minimatch';
import { onMessage } from 'webext-bridge/devtools';
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

  useEffect(() => {
    document.body.classList.toggle('dark', theme.isDarkMode);
  }, [theme.isDarkMode]);

  useEffect(() => {
    onMessage('request:sent', ({ data }) => {
      const patterns = ['https://*api.segment.io/v1/*'];
      const Rules = RequestSentMessage.extend({
        method: z.literal('POST'),
        tabId: z.literal(id),
      });

      const validation = Rules.safeParse(data);

      if (!validation.success) {
        return;
      }

      try {
        const { url, body, id } = validation.data;
        if (patterns.some(pattern => minimatch(url, pattern))) {
          const event = JSON.parse(body);
          eventBrowser.add({ ...event, _request: { id } });
        }
      } catch (e) {
        console.error(e);
      }
    });

    onMessage('request:complete', ({ data }) => {
      const Rules = RequestDoneMessage.extend({
        tabId: z.literal(id),
      });

      const validation = Rules.safeParse(data);

      if (validation.success) {
        const { id, ...response } = validation.data;
        eventBrowser.setReponse(id, response.timestamp, response.code, response.error);
      }
    });
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
