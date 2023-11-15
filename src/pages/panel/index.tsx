import Panel from '@pages/panel/Panel';
import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/panel');

function init() {
  const panel = document.querySelector('#panel');

  if (!panel) {
    throw new Error('Can not find #panel');
  }

  const root = createRoot(panel);
  root.render(<Panel />);
}

init();
