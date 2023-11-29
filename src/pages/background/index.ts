import { RequestDoneMessage, RequestSentMessage } from '@root/src/shared/types';
import dayjs from 'dayjs';
import { sendMessage } from 'webext-bridge/background';
import browser, { WebRequest, webRequest } from 'webextension-polyfill';

const postMessage = (tab: number, subject: string, data) => {
  const destination = `devtools@${tab}`;

  if (tab < 1) {
    console.log(`[Background] Skipped sending message to ${destination}`);
    return;
  }

  try {
    sendMessage(subject, data, destination);
  } catch (error) {
    console.error(`[Background] Error sending message to ${destination}`, error);
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
    const validation = RequestSentMessage.safeParse({
      id: requestId,
      url,
      method,
      body,
      tabId,
    });

    if (validation.success) {
      postMessage(tabId, 'request:sent', validation.data);
    }
  },
  onRequestCompleted: (details: WebRequest.OnCompletedDetailsType) => {
    const { requestId, statusCode, tabId, timeStamp } = details;
    const validation = RequestDoneMessage.safeParse({
      id: requestId,
      code: statusCode,
      timestamp: dayjs(timeStamp).toISOString(),
      tabId,
    });

    if (validation.success) {
      postMessage(tabId, 'request:complete', validation.data);
    }
  },
  onRequestFailed: (details: WebRequest.OnErrorOccurredDetailsType) => {
    const { requestId, tabId, timeStamp, error } = details;
    const validation = RequestDoneMessage.safeParse({
      id: requestId,
      error,
      code: 0,
      timestamp: dayjs(timeStamp).toISOString(),
      tabId,
    });

    if (validation.success) {
      postMessage(tabId, 'request:complete', validation.data);
    }
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

browser.runtime.onInstalled.addListener(() => {
  listenToNetworkRequests();
});
