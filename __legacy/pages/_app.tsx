import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import '@fontsource/montserrat/700.css';

import { appTheme } from '../theme';
import { ClientStateProvider } from '../components/contexts/ClientStateContext';

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={appTheme}>
      <QueryClientProvider client={queryClient}>
        <ClientStateProvider>
          <Component {...pageProps} />
        </ClientStateProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
