import { useCurrentRoom } from '../lib/hooks';
import { RoomDetail } from '../components/RoomDetail';
import { Layout } from '../components/Layout';

export default function RoomPage() {
  const { room } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
      refetchInterval: 10000
    },
    redirectToIfOutsideRoom: '/'
  });

  return (
    <Layout title={room?.name}>
      {room ? <RoomDetail room={room} /> : null}
    </Layout>
  );
}
