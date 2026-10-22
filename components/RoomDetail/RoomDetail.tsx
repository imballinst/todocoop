import { useEffect, useRef } from 'react';
import { Box, Button, Flex, Heading, Table } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';

import { useSyncRoom } from '../../lib/ui/hooks';
import type { BaseTodo, UiRoom } from '../../lib/models/types';
import { TodoForm, TodoFormPlaceholder } from './TodoForm';
import { ActionsMenu } from './ActionsMenu';
import { useTodos } from './todos';
import type { RoomFormState } from './types';

interface RoomProps {
  room: UiRoom;
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos: roomTodos } = room;

  const queryClient = useQueryClient();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const {
    control,
    handleSubmit,
    fieldArrayActions,
    lastIndexRef,
    removedTodosRef,
    reset,
    todos
  } = useTodos({ roomTodos });

  useEffect(() => {
    const interval = setInterval(() => {
      // Every 5 seconds, if it's idle, then sync.
      submitButtonRef.current?.click();
    }, 5000);

    lastIndexRef.current = todos.length - 1;

    return () => {
      // When it's changed, the previous interval is cleared.
      clearInterval(interval);
    };
  }, [lastIndexRef, todos]);

  const syncMutations = useSyncRoom({
    onSettled: (room) => {
      reset({ todos: room.todos });
      removedTodosRef.current = [];
    }
  });

  async function onDataValid(data: RoomFormState) {
    const added: BaseTodo[] = [];
    const modified: BaseTodo[] = [];
    const removed: BaseTodo[] = removedTodosRef.current.map((todo) =>
      omitFieldFromObject(todo, 'state')
    );

    for (const todo of data.todos) {
      switch (todo.state) {
        case 'added': {
          added.push(omitFieldFromObject(todo, 'state'));
          break;
        }
        case 'modified': {
          modified.push(omitFieldFromObject(todo, 'state'));
          break;
        }
      }
    }

    if (added.length || modified.length || removed.length) {
      await syncMutations.mutateAsync({
        name,
        todos: {
          added,
          removed,
          modified
        }
      });
    } else {
      // If nothing is modified, then just invalidate the room query.
      // So that we can refetch.
      queryClient.invalidateQueries({ queryKey: ['room'] });
    }
  }

  return (
    <form onSubmit={handleSubmit(onDataValid)}>
      <Flex px={3} flexDirection="row" justifyContent="space-between">
        <Heading
          as="h1"
          size="md"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {name}
        </Heading>
        <Box position="relative">
          <ActionsMenu
            room={room}
            currentTodos={todos}
            append={fieldArrayActions.append}
          />
        </Box>
      </Flex>
      <Box mt={4}>
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

        <Button hidden type="submit" ref={submitButtonRef} />
      </Box>
    </form>
  );
}

function omitFieldFromObject<T>(obj: T, omittedKey: keyof T) {
  const newObj = { ...obj };
  delete newObj[omittedKey];

  return newObj;
}
