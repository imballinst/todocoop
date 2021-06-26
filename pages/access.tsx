import { Layout } from '../components/Layout';
import { accessRoom } from '../query/rooms';
import { RoomForm } from '../components/RoomForm';
import { useCurrentRoom } from '../lib/hooks';

export default function AccessRoom() {
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
      title="Access Room"
    >
      <RoomForm
        request={accessRoom}
        onSuccessfulAccess={onSuccessfulAccess}
        title="Access room"
        loadingButtonTitle="Accessing room..."
      />
    </Layout>
  );
}
