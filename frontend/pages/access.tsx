import { UseCurrentRoomType } from '../lib/hooks';
import { Layout } from '../components/Layout';
import { accessRoom } from '../query/rooms';
import { RoomForm } from '../components/RoomForm';

interface AccessRoomProps {
  refetchRoom: UseCurrentRoomType['refetchRoom'];
}

export default function AccessRoom({ refetchRoom }: AccessRoomProps) {
  return (
    <Layout title="Access Room">
      <RoomForm
        request={accessRoom}
        onSuccessfulAccess={refetchRoom}
        title="Access room"
      />
    </Layout>
  );
}
