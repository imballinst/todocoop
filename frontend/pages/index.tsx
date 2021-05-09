import { QueryClient, QueryClientProvider } from 'react-query';

import { RoomForm } from './RoomForm';
import { createRoom } from './query/rooms';
import { useCurrentRoom } from '../lib/useCurrentRoom';
import { Room } from './Room';

function IndexPage() {
  const { room, refetchRoom } = useCurrentRoom();

  return (
    <>
      {room === undefined ? (
        <RoomForm request={createRoom} onSuccessfulAccess={refetchRoom} />
      ) : (
        <Room room={room} />
      )}
    </>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IndexPage />
    </QueryClientProvider>
  );
}
