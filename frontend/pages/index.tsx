import { QueryClient, QueryClientProvider } from 'react-query';
import { Box, Button, ChakraProvider, VStack } from '@chakra-ui/react';

import { useCurrentRoom } from '../lib/hooks';
import { RoomDetail } from './Room';
import { taskyTheme } from './theme';
import { TaskyLink } from './components/TaskyLink';
import { Layout } from './components/Layout';

function IndexPage() {
  const { room } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    }
  });

  return (
    <Layout title="Home">
      <Box height="calc(100vh - 48px)">
        {room === undefined ? (
          <VStack spacing={2}>
            <TaskyLink href="/create">
              <Button>Create Room</Button>
            </TaskyLink>
            <TaskyLink href="/access">
              <Button>Access Room</Button>
            </TaskyLink>
          </VStack>
        ) : (
          <RoomDetail room={room} />
        )}
      </Box>
    </Layout>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <ChakraProvider theme={taskyTheme}>
      <QueryClientProvider client={queryClient}>
        <IndexPage />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
