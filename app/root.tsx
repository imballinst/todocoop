import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from 'react-router';

import '@fontsource/montserrat/700.css';

import { ClientStateProvider } from '../components/contexts/ClientStateContext';
import { Toaster } from '../components/Toaster';
import { system } from '../theme';
import './app.css';

const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <ClientStateProvider>
            <Outlet />
            <Toaster />
          </ClientStateProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}

export function HydrateFallback() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Loading…</div>
  );
}
