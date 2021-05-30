import { UseCurrentRoomType } from '../lib/hooks';
import { Layout } from './components/Layout';
import { accessRoom } from './query/rooms';
import { RoomForm } from './RoomForm';

interface AccessRoomProps {
  refetchRoom: UseCurrentRoomType['refetchRoom'];
}

export default function AccessRoom({ refetchRoom }: AccessRoomProps) {
  return (
    <Layout title="Access room">
      <RoomForm request={accessRoom} onSuccessfulAccess={refetchRoom} />
    </Layout>
  );
}
