import { Table } from '@chakra-ui/react';
import { useEffect } from 'react';
import type { AxiosResponse } from 'axios';

import type { BaseRoom, UiRoom } from '../../../lib/models/types';
import type { ApiResponse } from '../../../lib/server/api';
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

  const response: AxiosResponse<ApiResponse<BaseRoom>> = {
    config: {},
    data: {
      data: {
        name: 'test',
        password: 'test',
        todos: []
      }
    },
    status: 200,
    statusText: 'hello',
    headers: {}
  } as AxiosResponse<ApiResponse<BaseRoom>>;

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

const INITIAL_STATE = [];

export function HowToModifyTodos() {
  const { control, fieldArrayActions, lastIndexRef, todos } = useTodos({
    roomTodos: INITIAL_STATE,
    limit: 5
  });

  useEffect(() => {
    lastIndexRef.current = todos.length - 1;
  }, [lastIndexRef, todos]);

  return (
    <Table.Root variant="line" width="100%">
      <Table.Body>
        {todos.map((todo, index) => (
          <Table.Row key={`${todo.localId}-${index}`}>
            <TodoForm
              index={index}
              todo={todo}
              control={control}
              lastIndexRef={lastIndexRef}
              {...fieldArrayActions}
            />
          </Table.Row>
        ))}

        {todos.length === 0 && (
          <Table.Row>
            <TodoFormPlaceholder insert={fieldArrayActions.insert} />
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
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
