import { RoomForm } from '../../RoomForm';

const onSuccessfulAccess = () => {};
const request = async () => {
  // Simulate request roundtrip.
  return new Promise((res) => {
    setTimeout(() => {
      res({ data: {} });
    }, 1000);
  });
};

export default function HowToUseRoomAccess() {
  return (
    <RoomForm
      onSuccessfulAccess={onSuccessfulAccess}
      loadingButtonTitle="Access room"
      request={request}
      title="Access room"
    />
  );
}
