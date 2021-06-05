import { useCurrentRoom } from '../lib/hooks';
import { RoomDetail } from '../components/Room';
import { Layout } from '../components/Layout';

export default function IndexPage() {
  const { room } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    }
  });

  return (
    <Layout title={room.name}>
      <RoomDetail room={room} />
    </Layout>
  );
}
