import { useCurrentRoom } from '../lib/hooks';
import { RoomDetail } from '../components/RoomDetail';
import { Layout } from '../components/Layout';

export default function RoomPage() {
  const { room, isFetching } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
      refetchInterval: 10000
    },
    redirectToIfOutsideRoom: '/'
  });

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
