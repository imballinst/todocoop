import { UseCurrentRoomType } from '../lib/hooks';
import { Layout } from './components/Layout';
import { createRoom } from './query/rooms';
import { RoomForm } from './RoomForm';

interface CreateRoomProps {
  refetchRoom: UseCurrentRoomType['refetchRoom'];
}

export default function CreateRoom({ refetchRoom }: CreateRoomProps) {
  return (
    <Layout title="Create Room">
      <RoomForm
        request={createRoom}
        onSuccessfulAccess={refetchRoom}
        submitButtonTitle="Create room"
      />
    </Layout>
  );
}
