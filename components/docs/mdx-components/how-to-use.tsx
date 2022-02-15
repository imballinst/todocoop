import { useRef, useState } from 'react';
import { UiTodo } from '../../../lib/models/types';
import { ActionsMenu } from '../../RoomDetail/ActionsMenu';
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

export function HowToUseRoomAccess() {
  return (
    <RoomForm
      onSuccessfulAccess={onSuccessfulAccess}
      loadingButtonTitle="Access room"
      request={request}
      title="Access room"
    />
  );
}

const stubFn = () => {};

const ROOM_OBJECT = {
  name: 'Test Room',
  password: 'Test Password',
  todos: [
    {
      isChecked: false,
      title: 'hello world',
      _id: 'test-id',
      isPersisted: true,
      localId: 'test-id'
    }
  ]
};

export function HowToUseEditTodo() {
  const localIdToEditedListElementMap = useRef<Record<string, UiTodo>>({});
  const [currentTodos, setCurrentTodos] = useState<UiTodo[]>(ROOM_OBJECT.todos);

  return null;
}

export function HowToUseActionsMenu() {
  return (
    <ActionsMenu
      room={ROOM_OBJECT}
      currentTodos={ROOM_OBJECT.todos}
      onLeaveRoom={stubFn}
    />
  );
}
