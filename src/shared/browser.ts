import browser, { type WebRequest } from 'webextension-polyfill';

type NetworkRequest = {
  url: string;
  method: string;
  body: string;
  origin: number;
};

export const background = {
  onBeforeRequest: (handler: (details: WebRequest.OnBeforeRequestDetailsType) => void) => {
    const isListening = () => {
      return browser.webRequest.onBeforeRequest.hasListener(handler);
    };

    const start = () => {
      if (!isListening()) {
        browser.webRequest.onBeforeRequest.addListener(
          handler,
          { urls: ['https://*/*', 'http://*/*'], types: ['xmlhttprequest'] },
          ['requestBody'],
        );
      }

      console.log('Listening for network requests in the background.');
    };

    const stop = () => {
      if (isListening()) {
        browser.webRequest.onBeforeRequest.removeListener(handler);
      }

      console.log('Stopped listening for network requests.');
    };

    messaging.listen('listener:start', start, true);
    messaging.listen('listener:stop', stop, true);
  },
};

export const messaging = {
  send: (type: string, data: unknown = null) => {
    return browser.runtime.sendMessage({ type, data });
  },
  listen: (type: string, handler: (data: unknown) => void, once = false) => {
    const listener = (message: Record<string, unknown>) => {
      if (typeof message === 'object' && message.type === type) {
        handler(message.data);
      }
      if (once) {
        browser.runtime.onMessage.removeListener(listener);
      }
    };

    if (!browser.runtime.onMessage.hasListener(listener)) {
      browser.runtime.onMessage.addListener(listener);
    }
  },
};

export const window = {
  get id() {
    return browser.devtools.inspectedWindow.tabId;
  },
  onRequest: (handler: (request: NetworkRequest) => void) => {
    console.log('Attaching message listener');
    messaging.listen('request', (data: Record<string, unknown>) => {
      if (data.origin !== window.id) {
        return;
      }

      console.debug('Received request message', data);
      handler(data as NetworkRequest);
    });
  },
  reload: () => {
    browser.devtools.inspectedWindow.reload({
      ignoreCache: true,
    });
  },
};

export const devtools = {
  panel: (title: string, icon: string, url: string) => {
    browser.devtools.panels.create(title, icon, url).then(panel => {
      panel.onShown.addListener(() => {
        messaging.send('listener:start');
      });
      panel.onHidden.addListener(() => {
        messaging.send('listener:stop');
      });
    });
  },
};
