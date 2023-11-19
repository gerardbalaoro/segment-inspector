import { devtools, runtime } from 'webextension-polyfill';

type NetworkRequest = {
  url: string;
  method: string;
  body: string;
};

export const onRequest = (handler: (request: NetworkRequest) => void) => {
  console.log('Attaching message listener');
  runtime.onMessage.addListener((message: Record<string, unknown>) => {
    if (message.type !== 'request') {
      return;
    }

    delete message.type;
    console.debug('Received request message', message);
    handler(message as NetworkRequest);
  });
};

export const reload = () => {
  devtools.inspectedWindow.reload({
    ignoreCache: true,
  });
};

export const createPanel = (title: string, icon: string, url: string) => {
  devtools.panels.create(title, icon, url).then(panel => {
    panel.onShown.addListener(() => console.log(`${title} panel loaded`));
    panel.onHidden.addListener(() => console.log(`${title} panel hidden`));
  });
};
