import { QueryClient, QueryClientProvider } from 'react-query';

import { RoomAccessForm } from './RoomAccessForm';
import { createRoom } from './query/rooms';
import { useCurrentRoom } from '../lib/useCurrentRoom';

function IndexPage() {
  const { room, refetchRoom } = useCurrentRoom();

  return (
    <>
      <h1>Hello Next.js 👋</h1>

      {room === undefined ? (
        <RoomAccessForm request={createRoom} onSuccessfulAccess={refetchRoom} />
      ) : null}
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
