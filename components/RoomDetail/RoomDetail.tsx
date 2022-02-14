import React, { useEffect, useRef } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Table, Tbody, Tr } from '@chakra-ui/table';
import { useFieldArray, useForm } from 'react-hook-form';

import { useSyncRoom } from '../../lib/ui/hooks';
import { BaseRoom } from '../../lib/models/types';
import { TodoForm } from './TodoForm';
import { ActionsMenu } from './ActionsMenu';
import { RoomFormState } from './types';

interface RoomProps {
  room: BaseRoom;
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos: roomTodos } = room;
  const { control, handleSubmit, setFocus } = useForm<RoomFormState>({
    mode: 'onBlur',
    defaultValues: {
      todos: roomTodos
    }
  });
  const {
    fields: todos,
    remove,
    insert
  } = useFieldArray({ control, name: 'todos' });
  const submitButtonRef = useRef<HTMLButtonElement>();

  useEffect(() => {
    const interval = setInterval(() => {
      // Every 10 seconds, if it's idle, then sync.
      submitButtonRef.current.click();
    }, 10000);

    return () => {
      // When it's changed, the previous interval is cleared.
      clearInterval(interval);
    };
  }, [todos]);

  const syncMutations = useSyncRoom();

  async function onDataValid(data: RoomFormState) {
    await syncMutations.mutateAsync({ room: { ...room, todos: data.todos } });
  }

  const fieldArrayActions = { remove, insert, setFocus };

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
                <Tr key={todo.localId}>
                  <TodoForm
                    index={index}
                    todo={todo}
                    control={control}
                    {...fieldArrayActions}
                  />
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Button hidden type="submit" ref={submitButtonRef} />
        </Box>
      </form>
    </>
  );
}
