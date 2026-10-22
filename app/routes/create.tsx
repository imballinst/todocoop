import { Layout } from '../../components/Layout';
import { createRoom } from '../../lib/ui/query/rooms';
import { RoomForm } from '../../components/RoomForm';
import { useCurrentRoom } from '../../lib/ui/hooks';

export function meta() {
  return [{ title: 'Create Room - TodoCoop' }];
}

export default function CreateRoomRoute() {
  const { isFetching, room, refetchRoom } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    },
    redirectToIfInsideRoom: '/room'
  });

  return (
    <Layout isFetching={isFetching} isLoggedInToARoom={room !== undefined}>
      <RoomForm
        request={createRoom}
        onSuccessfulAccess={refetchRoom}
        title="Create room"
        loadingButtonTitle="Creating room..."
      />
    </Layout>
  );
}
