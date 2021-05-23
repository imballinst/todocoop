import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';

import { RoomForm } from './RoomForm';
import { createRoom } from './query/rooms';
import { useCurrentRoom } from '../lib/useCurrentRoom';
import { RoomDetail } from './Room';

function IndexPage() {
  const { room, refetchRoom } = useCurrentRoom({
    queryOptions: {
      refetchInterval: 10000
    }
  });

  return (
    <>
      {room === undefined ? (
        <RoomForm request={createRoom} onSuccessfulAccess={refetchRoom} />
      ) : (
        <RoomDetail room={room} />
      )}
    </>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <IndexPage />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
