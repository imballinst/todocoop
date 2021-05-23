import { QueryClient, QueryClientProvider } from 'react-query';
import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';

import { RoomForm } from './RoomForm';
import { createRoom } from './query/rooms';
import { useCurrentRoom } from '../lib/hooks';
import { RoomDetail } from './Room';

function IndexPage() {
  const { room, refetchRoom } = useCurrentRoom({
    queryOptions: {
      refetchInterval: 10000
    }
  });

  return (
    <Box>
      {room === undefined ? (
        <RoomForm request={createRoom} onSuccessfulAccess={refetchRoom} />
      ) : (
        <RoomDetail room={room} />
      )}
    </Box>
  );
}

const queryClient = new QueryClient();
const theme = extendTheme();

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <IndexPage />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
