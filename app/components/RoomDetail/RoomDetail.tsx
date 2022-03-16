import React, { useEffect, useRef } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Table, Tbody, Tr } from '@chakra-ui/table';

import { UiRoom, BaseTodo } from '../../lib/models/types';
import { TodoForm, TodoFormPlaceholder } from './TodoForm';
import { ActionsMenu } from './ActionsMenu';
import { useTodos } from './todos';
import { RoomFormState } from './types';
import { useFetcher } from 'remix';

interface RoomProps {
  room: UiRoom;
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos: roomTodos } = room;

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

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
      if (submitButtonRef.current) {
        // Every 5 seconds, if it's idle, then sync.
        submitButtonRef.current.click();
      }
    }, 5000);

    lastIndexRef.current = todos.length - 1;

    return () => {
      // When it's changed, the previous interval is cleared.
      clearInterval(interval);
    };
  }, [lastIndexRef, todos]);

  const todosFetcher = useFetcher();

  useEffect(() => {
    if (todosFetcher.type === 'done' && todosFetcher.data.todos) {
      reset({ todos: todosFetcher.data.todos });
      removedTodosRef.current = [];
    }
  }, [reset, todosFetcher]);

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
      todosFetcher.submit({
        data: JSON.stringify({
          added,
          removed,
          modified
        })
      });
    }
  }

  return (
    <>
      <todosFetcher.Form
        ref={formRef}
        onSubmit={handleSubmit(onDataValid)}
        method="put"
        action={`/api/rooms/${room._id}`}
      >
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

          <Button hidden type="submit" ref={submitButtonRef} />
        </Box>
      </todosFetcher.Form>
    </>
  );
}

function omitFieldFromObject<T>(obj: T, omittedKey: keyof T) {
  const newObj = { ...obj };
  delete newObj[omittedKey];

  return newObj;
}
