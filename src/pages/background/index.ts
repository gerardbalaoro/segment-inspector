import { runtime, webRequest } from 'webextension-polyfill';

console.log('Listening to network requests');
webRequest.onBeforeRequest.addListener(
  ({ url, requestBody, method }) => {
    if (typeof requestBody?.raw === 'undefined') {
      return;
    }

    const body = String.fromCharCode.apply(null, new Uint8Array(requestBody.raw[0].bytes));

    console.debug('Intercepted request', url);
    runtime.sendMessage({ type: 'request', url, body, method });
  },
  { urls: ['<all_urls>'] },
  ['requestBody'],
);
