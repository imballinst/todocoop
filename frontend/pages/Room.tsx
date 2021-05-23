import {
  ChangeEvent,
  memo,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react';
import { Checkbox } from '@chakra-ui/checkbox';
import { FormHelperText, FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Heading, HStack, List, ListItem } from '@chakra-ui/layout';
import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Button, IconButton } from '@chakra-ui/button';
import { Table, TableCellProps, Tbody, Td, Tr } from '@chakra-ui/table';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { generateHash } from '../lib/utils';
import { useRoomMutations } from '../lib/hooks';
import { BaseTodo, BaseRoom } from '../types/models';

interface RoomProps {
  room: BaseRoom;
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos } = room;

  const [currentTodos, setCurrentTodos] = useState(resolveExistingTodos(todos));
  const previousRoom = useRef(room);

  useEffect(() => {
    if (previousRoom.current.__v !== room.__v) {
      setCurrentTodos(resolveExistingTodos(room.todos));
      previousRoom.current = room;
    }
  }, [room]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Box>
        <Heading as="h1" size="xl" p={4} background="teal" color="white">
          {name}
        </Heading>
        <Box p={4}>
          <Table variant="simple" width="unset">
            <Tbody>
              {currentTodos.map((todo, index) => (
                <Tr>
                  <TodoForm roomName={name} index={index} todo={todo} />
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Button
            mt={4}
            colorScheme="teal"
            onClick={() =>
              setCurrentTodos((oldTodos) =>
                oldTodos.concat({
                  isPersisted: false,
                  is_checked: false,
                  title: ''
                })
              )
            }
          >
            Add
          </Button>
        </Box>
      </Box>
    </form>
  );
}

// Helper functions/components.
const TodoForm = memo(
  ({
    roomName,
    todo,
    index
  }: {
    roomName: string;
    todo: BaseTodo;
    index: number;
  }) => {
    const {
      control,
      formState: { errors }
    } = useForm({
      defaultValues: todo
    });

    const [isEditing, setIsEditing] = useState(false);
    const previousValue = useRef<BaseTodo>(todo);

    const {
      isPersisted,
      _id: todoId,
      title,
      is_checked: isChecked
    } = useWatch({ control });
    const { addTodoMutation, updateTodoMutation, deleteTodoMutation } =
      useRoomMutations();

    function onSave() {
      // Finish save happens when the text field is blurred, or when
      // the checkbox tick is changed.
      if (!isPersisted) {
        addTodoMutation.mutate({
          name: roomName,
          todo: {
            title,
            is_checked: isChecked
          }
        });
      } else {
        updateTodoMutation.mutate({
          name: roomName,
          todo: {
            _id: todoId,
            isPersisted: true,
            title,
            is_checked: isChecked
          }
        });
      }

      previousValue.current = todo;
      setIsEditing(false);
    }

    function onChangeTick(e: ChangeEvent<HTMLInputElement>) {
      previousValue.current = todo;
      updateTodoMutation.mutate({
        name: roomName,
        todo: {
          _id: todoId,
          isPersisted: true,
          title,
          is_checked: e.target.checked
        }
      });
    }

    function onDelete() {
      deleteTodoMutation.mutate({ name: roomName, todoId: todo._id });
    }

    return isEditing ? (
      <>
        <TableColumn>
          <Controller
            render={({ field }) => (
              <Checkbox
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                checked={field.value}
                ref={field.ref}
              />
            )}
            name="is_checked"
            control={control}
          />
        </TableColumn>

        <TableColumn>
          <FormControl>
            <Controller
              render={({ field }) => <Input {...field} />}
              name="title"
              control={control}
            />

            {errors[index]?.title && (
              <FormHelperText>{errors[index]?.title}</FormHelperText>
            )}
          </FormControl>
        </TableColumn>

        <TableColumn>
          <IconButton
            minWidth="var(--chakra-sizes-6)"
            height="var(--chakra-sizes-6)"
            colorScheme="teal"
            onClick={onSave}
            aria-label="Save"
            icon={<CheckIcon />}
          />
        </TableColumn>
      </>
    ) : (
      <>
        <TableColumn colSpan={2}>
          <Controller
            render={({ field }) => (
              <Checkbox
                name={field.name}
                onBlur={field.onBlur}
                checked={field.value}
                ref={field.ref}
                onChange={onChangeTick}
              >
                {todo.title}
              </Checkbox>
            )}
            name="is_checked"
            control={control}
          />
        </TableColumn>
        <TableColumn>
          <HStack spacing={2}>
            <IconButton
              minWidth="var(--chakra-sizes-6)"
              height="var(--chakra-sizes-6)"
              colorScheme="teal"
              onClick={() => setIsEditing(true)}
              aria-label="Edit"
              icon={<EditIcon />}
            />
            <IconButton
              minWidth="var(--chakra-sizes-6)"
              height="var(--chakra-sizes-6)"
              colorScheme="teal"
              onClick={onDelete}
              aria-label="Edit"
              icon={<DeleteIcon />}
            />
          </HStack>
        </TableColumn>
      </>
    );
  }
);

function TableColumn(props: { children: ReactNode } & TableCellProps) {
  return <Td {...props} paddingInline={3} py={2} />;
}

function resolveExistingTodos(todos: BaseTodo[]): BaseTodo[] {
  return todos.map((todo) => ({
    _id: generateHash(),
    isPersisted: true,
    ...todo
  }));
}
