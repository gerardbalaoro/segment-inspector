import type { RequestMessage, ResponseMessage } from '@root/src/shared/types';
import dayjs from 'dayjs';
import { minimatch } from 'minimatch';
import browser, { Runtime, WebRequest, webRequest } from 'webextension-polyfill';

const connections: Record<string, Runtime.Port> = {};

const dispatch = (target: string, event: string, data: unknown) => {
  for (const port of Object.values(connections)) {
    if (!minimatch(port.name, target)) {
      continue;
    }

    port.postMessage({ event, data });
  }
};

const listeners = {
  onRequestSent: (details: WebRequest.OnBeforeRequestDetailsType) => {
    const { requestId, url, requestBody, method, tabId } = details;

    if (
      typeof requestBody !== 'object' ||
      !Array.isArray(requestBody.raw) ||
      requestBody.raw.length === 0 ||
      !requestBody.raw[0].bytes
    ) {
      return;
    }

    const body = String.fromCharCode.apply(null, new Uint8Array(requestBody.raw[0].bytes));
    const data: RequestMessage = { id: requestId, url, method, body, tabId };

    dispatch(`*-${tabId}`, 'request:sent', data);
  },
  onRequestCompleted: (details: WebRequest.OnCompletedDetailsType) => {
    const { requestId, statusCode, tabId, timeStamp } = details;
    const data: ResponseMessage = {
      id: requestId,
      code: statusCode,
      timestamp: dayjs(timeStamp).toISOString(),
      tabId,
    };

    dispatch(`*-${tabId}`, 'request:complete', data);
  },
  onRequestFailed: (details: WebRequest.OnErrorOccurredDetailsType) => {
    const { requestId, tabId, timeStamp, error } = details;
    const data: ResponseMessage = {
      id: requestId,
      error,
      code: 0,
      timestamp: dayjs(timeStamp).toISOString(),
      tabId,
    };

    dispatch(`*-${tabId}`, 'request:complete', data);
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

const listenToNetworkRequests = () => {
  const filters: WebRequest.RequestFilter = {
    urls: ['https://*/*', 'http://*/*'],
    types: ['xmlhttprequest'],
  };

  if (!webRequest.onBeforeRequest.hasListener(listeners.onRequestSent)) {
    webRequest.onBeforeRequest.addListener(listeners.onRequestSent, filters, ['requestBody']);
  }

  if (!webRequest.onCompleted.hasListener(listeners.onRequestCompleted)) {
    webRequest.onCompleted.addListener(listeners.onRequestCompleted, filters, ['responseHeaders']);
  }

  if (!webRequest.onErrorOccurred.hasListener(listeners.onRequestFailed)) {
    webRequest.onErrorOccurred.addListener(listeners.onRequestFailed, filters);
  }

  console.log('[Background] Listening for network requests.');
};

browser.runtime.onConnect.addListener(listeners.onConnect);
listenToNetworkRequests();
