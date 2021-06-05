import { Layout } from '../components/Layout';
import { accessRoom } from '../query/rooms';
import { RoomForm } from '../components/RoomForm';
import { useCurrentRoom } from '../lib/hooks';

export default function AccessRoom() {
  const { refetchRoom, isFetching } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    }
  });

  function onSuccessfulAccess() {
    refetchRoom();
  }

  return (
    <Layout title="Access Room">
      <RoomForm
        request={accessRoom}
        onSuccessfulAccess={onSuccessfulAccess}
        title="Access room"
        loadingButtonTitle="Accessing room..."
      />
    </Layout>
  );
}
