import { Layout } from '../components/Layout';
import { createRoom } from '../query/rooms';
import { RoomForm } from '../components/RoomForm';
import { useCurrentRoom } from '../lib/hooks';

export default function CreateRoom() {
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
    <Layout title="Create Room">
      <RoomForm
        request={createRoom}
        onSuccessfulAccess={onSuccessfulAccess}
        title="Create room"
        loadingButtonTitle="Creating room..."
      />
    </Layout>
  );
}
