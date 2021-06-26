import { Layout } from '../components/Layout';
import { createRoom } from '../query/rooms';
import { RoomForm } from '../components/RoomForm';
import { useCurrentRoom } from '../lib/hooks';

export default function CreateRoom() {
  const { isFetching, room, refetchRoom } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    },
    redirectToIfInsideRoom: '/room'
  });

  function onSuccessfulAccess() {
    refetchRoom();
  }

  return (
    <Layout
      isFetching={isFetching}
      isLoggedInToARoom={room !== undefined}
      title="Create Room"
    >
      <RoomForm
        request={createRoom}
        onSuccessfulAccess={onSuccessfulAccess}
        title="Create room"
        loadingButtonTitle="Creating room..."
      />
    </Layout>
  );
}
