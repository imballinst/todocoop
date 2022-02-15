import React, { useCallback, useEffect, useRef } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Table, Tbody, Tr } from '@chakra-ui/table';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

import { useSyncRoom } from '../../lib/ui/hooks';
import { BaseRoom, BaseTodo, UiTodo } from '../../lib/models/types';
import { TodoForm, TodoFormPlaceholder } from './TodoForm';
import { ActionsMenu } from './ActionsMenu';
import { RoomFormState } from './types';

interface RoomProps {
  room: BaseRoom;
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos: roomTodos } = room;

  const queryClient = useQueryClient();
  const { control, handleSubmit, setFocus, reset } = useForm<RoomFormState>({
    mode: 'onBlur',
    defaultValues: {
      todos: roomTodos
    }
  });
  const {
    fields: todos,
    remove: fieldArrayRemove,
    insert,
    update
  } = useFieldArray({ control, name: 'todos' });
  const submitButtonRef = useRef<HTMLButtonElement>();
  const removedTodosRef = useRef<UiTodo[]>([]);
  const lastIndexRef = useRef(todos.length);

  useEffect(() => {
    reset({ todos: roomTodos });
    lastIndexRef.current = roomTodos.length - 1;
  }, [reset, roomTodos]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Every 10 seconds, if it's idle, then sync.
      submitButtonRef.current.click();
    }, 10000);

    lastIndexRef.current = todos.length - 1;

    return () => {
      // When it's changed, the previous interval is cleared.
      clearInterval(interval);
    };
  }, [todos]);

  const remove = useCallback(
    (todo: UiTodo, index: number) => {
      removedTodosRef.current.push(todo);
      fieldArrayRemove(index);
    },
    [fieldArrayRemove]
  );

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
      queryClient.invalidateQueries('room');
    }
  }

  const fieldArrayActions = { remove, insert, setFocus, update };

  return (
    <>
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
            <ActionsMenu room={room} currentTodos={todos} />
          </Box>
        </Flex>
        <Box mt={4}>
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
                  <TodoFormPlaceholder insert={insert} />
                </Tr>
              )}
            </Tbody>
          </Table>

          <Button hidden type="submit" ref={submitButtonRef} />
        </Box>
      </form>
    </>
  );
}

function omitFieldFromObject<T>(obj: T, omittedKey: keyof T) {
  const newObj = { ...obj };
  delete newObj[omittedKey];

  return newObj;
}
