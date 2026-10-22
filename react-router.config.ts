import type { Config } from '@react-router/dev/config';

export default {
  // This app is a SPA; client-side data fetching talks to the Netlify
  // function in netlify/functions/api.ts.
  ssr: false
} satisfies Config;
