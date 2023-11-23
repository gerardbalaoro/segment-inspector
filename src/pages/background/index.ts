// import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import browser, { Runtime, WebRequest } from 'webextension-polyfill';

// reloadOnUpdate('pages/background');

const connections: Record<string, Runtime.Port> = {};

const listeners = {
  onBeforeRequest: (details: WebRequest.OnBeforeRequestDetailsType) => {
    const { url, requestBody, method, tabId } = details;

    if (!requestBody || !(Array.isArray(requestBody.raw) && requestBody.raw.length > 0)) {
      return;
    }

    const body = String.fromCharCode.apply(null, new Uint8Array(requestBody.raw[0].bytes));

    for (const port of Object.values(connections)) {
      port.postMessage({
        event: 'request:sent',
        data: { url, requestBody, method, body, tabId },
      });
    }
  },
  onStartup: () => {
    if (browser.webRequest.onBeforeRequest.hasListener(listeners.onBeforeRequest)) {
      return;
    }

    browser.webRequest.onBeforeRequest.addListener(
      listeners.onBeforeRequest,
      { urls: ['https://*/*', 'http://*/*'], types: ['xmlhttprequest'] },
      ['requestBody'],
    );
    console.log('[Background] Listening for network requests.');
  },
  onConnect: (port: Runtime.Port) => {
    port.onDisconnect.addListener((port: Runtime.Port) => {
      delete connections[port.name];
      console.log('[Background] Disconnected from ' + port.name);
    });

    connections[port.name] = port;
    console.log('[Background] Connected to ' + port.name);
  },
};

browser.runtime.onConnect.addListener(listeners.onConnect);
listeners.onStartup();
