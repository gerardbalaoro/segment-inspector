import { background, messaging } from '@src/shared/browser';

background.onBeforeRequest(({ url, requestBody, method, tabId }) => {
  console.debug('Intercepted request', url);
  if (typeof requestBody?.raw === 'undefined') {
    return;
  }

  const body = String.fromCharCode.apply(null, new Uint8Array(requestBody.raw[0].bytes));

  messaging.send('request', { url, body, method, origin: tabId }).catch(error => {
    console.warn(error);
  });
});
