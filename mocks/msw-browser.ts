// Source: https://github.com/mswjs/examples/blob/master/examples/with-storybook/src/mocks/browser.js.
import { setupWorker } from 'msw';

// Export the worker instance, so we can await the activation on Storybook's runtime.
// You can use this reference to start the worker for local development as well.
export const mswWorker = typeof global.process === 'undefined' && setupWorker();
