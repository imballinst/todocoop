import { useCurrentRoom } from '../lib/hooks';
import { RoomDetail } from '../components/RoomDetail';
import { Layout } from '../components/Layout';
import { useClientState } from '../components/contexts/ClientStateContext';
import { useEffect } from 'react';

export default function RoomPage() {
  const { room, isFetching } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
      refetchInterval: 10000
    },
    redirectToIfOutsideRoom: '/'
  });
  const { setIsAccessingRoom } = useClientState();

  useEffect(() => {
    // This will also be fired during the unmount state.
    setIsAccessingRoom(room !== undefined);
  }, [room]);

  return (
    <Layout
      isFetching={isFetching}
      isLoggedInToARoom={room !== undefined}
      title={room?.name}
    >
      {room ? <RoomDetail room={room} /> : null}
    </Layout>
  );
}
