import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { taskyTheme } from './theme';

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={taskyTheme}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
