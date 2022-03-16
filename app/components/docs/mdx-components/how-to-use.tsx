import { Table, Tbody, Tr } from '@chakra-ui/react';
import { useEffect } from 'react';

import { BaseRoom, UiRoom } from '../../../lib/models/types';
import { ApiResponse } from '../../../lib/server/types';
import { ActionsMenu } from '../../RoomDetail/ActionsMenu';
import { TodoForm, TodoFormPlaceholder } from '../../RoomDetail/TodoForm';
import { useTodos } from '../../RoomDetail/todos';
import { RoomForm } from '../../RoomForm';

const onSuccessfulAccess = () => {};
const request = async () => {
  // Simulate request roundtrip.
  await new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, 1000);
  });

  const response: ApiResponse<BaseRoom> = {
    data: {
      name: 'test',
      password: 'test',
      todos: []
    }
  };

  return response;
};

export function HowToUseRoomAccess() {
  return (
    <RoomForm
      onSuccessfulAccess={onSuccessfulAccess}
      loadingButtonTitle="Accessing room..."
      request={request}
      title="Access room"
    />
  );
}

const stubFn = () => {};

const ROOM_OBJECT: UiRoom = {
  name: 'Test Room',
  password: 'Test Password',
  todos: [
    {
      isChecked: false,
      title: 'hello world',
      _id: 'test-id',
      indexOrder: 0,
      state: 'unmodified',
      updatedAt: new Date().toISOString(),
      localId: 'test-id'
    }
  ]
};

const INITIAL_STATE: UiRoom['todos'] = [];

export function HowToModifyTodos() {
  const { control, fieldArrayActions, lastIndexRef, todos } = useTodos({
    roomTodos: INITIAL_STATE,
    limit: 5
  });

  useEffect(() => {
    lastIndexRef.current = todos.length - 1;
  }, [lastIndexRef, todos]);

  return (
    <Table variant="simple" width="100%">
      <Tbody>
        {todos.map((todo, index) => (
          <Tr key={`${todo.localId}-${index}`}>
            <TodoForm
              index={index}
              todo={todo}
              control={control}
              lastIndexRef={lastIndexRef}
              {...fieldArrayActions}
            />
          </Tr>
        ))}

        {todos.length === 0 && (
          <Tr>
            <TodoFormPlaceholder insert={fieldArrayActions.insert} />
          </Tr>
        )}
      </Tbody>
    </Table>
  );
}

export function HowToUseActionsMenu() {
  const { fieldArrayActions } = useTodos({
    roomTodos: ROOM_OBJECT.todos,
    limit: 5
  });

  return (
    <ActionsMenu
      room={ROOM_OBJECT}
      currentTodos={ROOM_OBJECT.todos}
      onLeaveRoom={stubFn}
      append={fieldArrayActions.append}
    />
  );
}
