import { setupWorker } from 'msw/browser';
import { handlers } from './mswHandlers';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

export async function enableMocking() {
  if (typeof window === 'undefined') {
    return;
  }

  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });

//   console.log('🔄 MSW Service Worker enabled');
}