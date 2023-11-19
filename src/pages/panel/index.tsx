import Panel from '@pages/panel/Panel';
import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import { devtools } from 'webextension-polyfill';
import { createContext } from 'react';

refreshOnUpdate('pages/panel');

export const TabContext = createContext(null);

function init() {
  const panel = document.querySelector('#panel');

  if (!panel) {
    throw new Error('Can not find #panel');
  }

  const root = createRoot(panel);
  root.render(
    <TabContext.Provider value={devtools.inspectedWindow.tabId}>
      <Panel />
    </TabContext.Provider>,
  );
}

init();
