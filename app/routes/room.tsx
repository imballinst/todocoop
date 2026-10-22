import { useEffect } from 'react';

import { useCurrentRoom } from '../../lib/ui/hooks';
import { RoomDetail } from '../../components/RoomDetail';
import { Layout } from '../../components/Layout';
import { useClientState } from '../../components/contexts/ClientStateContext';

export function meta() {
  return [{ title: 'Room - TodoCoop' }];
}

export default function RoomRoute() {
  const { room, isFetching } = useCurrentRoom({
    redirectToIfOutsideRoom: '/'
  });
  const { setIsAccessingRoom } = useClientState();

  useEffect(() => {
    // This will also be fired during the unmount state.
    setIsAccessingRoom(room !== undefined);
  }, [room, setIsAccessingRoom]);

  return (
    <Layout isFetching={isFetching} isLoggedInToARoom={room !== undefined}>
      {room ? <RoomDetail room={room} /> : null}
    </Layout>
  );
}
