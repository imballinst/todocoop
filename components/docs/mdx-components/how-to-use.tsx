import { useRef, useState } from 'react';
import { useRoomMutations } from '../../../lib/hooks';
import { Dictionary } from '../../../types';
import { BaseTodo } from '../../../types/models';
import { ActionsMenu } from '../../RoomDetail/ActionsMenu';
import { AddTodoButtons } from '../../RoomDetail/AddTodoButtons';
import { TodoFormRaw } from '../../RoomDetail/TodoForm';
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

export function HowToUseAddTodoButtons() {
  return <AddTodoButtons onBulkAdd={stubFn} onSingleAdd={stubFn} />;
}

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
  const localIdToEditedListElementMap = useRef<Dictionary<BaseTodo>>({});
  const [currentTodos, setCurrentTodos] = useState<BaseTodo[]>(
    ROOM_OBJECT.todos
  );

  const { addTodoMutation, deleteTodoMutation, updateTodoMutation } =
    useRoomMutations({
      onCreateTodo: async () => ({}),
      onDeleteTodo: async () => ({}),
      onUpdateTodo: async () => ({})
    });

  return (
    <TodoFormRaw
      index={0}
      roomName="test"
      todo={currentTodos[0]}
      setCurrentTodos={setCurrentTodos}
      localIdToEditedListElementMap={localIdToEditedListElementMap}
      addTodoMutation={addTodoMutation}
      deleteTodoMutation={deleteTodoMutation}
      updateTodoMutation={updateTodoMutation}
    />
  );
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
