import { ChangeEvent, memo, useEffect, useRef, useState } from 'react';
import { Checkbox } from '@chakra-ui/checkbox';
import { FormHelperText, FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { HStack, List, ListItem } from '@chakra-ui/layout';
import { CheckIcon, EditIcon } from '@chakra-ui/icons';
import { Button, IconButton } from '@chakra-ui/button';
import {
  Control,
  FormState,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  useWatch
} from 'react-hook-form';
import {
  MutationFunction,
  useMutation,
  UseMutationResult,
  useQueryClient
} from 'react-query';

import { generateHash, replaceArrayElementAtIndex } from '../lib/utils';
import { ApiResponse } from '../types';
import { BaseTodo, BaseRoom } from '../types/models';
import {
  createTodo,
  deleteTodo,
  DeleteTodoParameters,
  TodoParameters,
  updateTodo,
  UpdateTodoParameters
} from './query/rooms';

interface RoomProps {
  room: BaseRoom;
}

interface RoomFormState {
  todos: BaseTodo[];
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos } = room;

  const queryClient = useQueryClient();

  const {
    control,
    register,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      todos: resolveExistingTodos(todos)
    } as RoomFormState
  });
  const [currentlyUpdatedIndex, setCurrentlyUpdatedIndex] =
    useState<number | undefined>();

  const todosWatch = useWatch({ control, name: 'todos' });
  const previousRoom = useRef(room);

  useEffect(() => {
    if (previousRoom.current.__v !== room.__v) {
      reset({
        todos: resolveExistingTodos(room.todos)
      });
      previousRoom.current = room;
    }
  }, [room]);

  // Source: https://react-query.tanstack.com/examples/optimistic-updates-typescript.
  const addTodoMutation = useMutateRoom(
    createTodo,
    async ({ todo: newTodo }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries('room');

      // Snapshot the previous value.
      const previousRoom = queryClient.getQueryData<BaseRoom>('room');

      // Optimistically update to the new value.
      if (previousRoom) {
        const newPersistedTodo = {
          isPersisted: true,
          is_checked: newTodo.is_checked,
          title: newTodo.title
        };

        queryClient.setQueryData<BaseRoom>('room', {
          ...previousRoom,
          todos: [...previousRoom.todos, newPersistedTodo]
        });
      }

      return { previousRoom };
    }
  );

  const updateTodoMutation = useMutateRoom(
    updateTodo,
    async ({ todo: updatedTodo }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries('room');

      // Snapshot the previous value.
      const previousRoom = queryClient.getQueryData<BaseRoom>('room');

      // Optimistically update to the new value.
      if (previousRoom) {
        const idx = previousRoom.todos.findIndex(
          (el) => el._id === updatedTodo._id
        );

        queryClient.setQueryData<BaseRoom>('room', {
          ...previousRoom,
          todos: replaceArrayElementAtIndex(
            previousRoom.todos,
            idx,
            updatedTodo
          )
        });
      }

      return { previousRoom };
    }
  );

  const deleteTodoMutation = useMutateRoom(deleteTodo, async ({ todoId }) => {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
    await queryClient.cancelQueries('room');

    // Snapshot the previous value.
    const previousRoom = queryClient.getQueryData<BaseRoom>('room');

    // Optimistically update to the new value.
    if (previousRoom) {
      const idx = previousRoom.todos.findIndex((el) => el._id === todoId);

      queryClient.setQueryData<BaseRoom>('room', {
        ...previousRoom,
        todos: replaceArrayElementAtIndex(previousRoom.todos, idx, undefined)
      });
    }

    return { previousRoom };
  });

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <h1>{name}</h1>
        <List spacing={2} listStyleType="none">
          {todosWatch.map((todo, index) => (
            <ListItem>
              <TodoForm
                roomName={name}
                errors={errors}
                index={index}
                register={register}
                todo={todo}
                control={control}
                setValue={setValue}
                addTodoMutation={addTodoMutation}
                updateTodoMutation={updateTodoMutation}
                deleteTodoMutation={deleteTodoMutation}
              />
            </ListItem>
          ))}
        </List>
        <Button
          colorScheme="teal"
          onClick={() => {
            setValue(
              'todos',
              todosWatch.concat({
                isPersisted: false,
                is_checked: false,
                title: ''
              })
            );
          }}
        >
          Add
        </Button>
      </div>
    </form>
  );
}

type UseMutationType<R, T> = UseMutationResult<
  ApiResponse<R>,
  unknown,
  T,
  MutateContext
>;

// Helper functions/components.
const TodoForm = memo(
  ({
    roomName,
    todo,
    errors,
    register,
    control,
    index,
    addTodoMutation,
    updateTodoMutation,
    deleteTodoMutation
  }: {
    roomName: string;
    todo: BaseTodo;
    errors: FormState<RoomFormState>['errors'];
    register: UseFormRegister<RoomFormState>;
    control: Control<RoomFormState>;
    index: number;
    setValue: UseFormSetValue<RoomFormState>;
    // Mutate handlers.
    addTodoMutation: UseMutationType<BaseTodo, TodoParameters>;
    updateTodoMutation: UseMutationType<BaseTodo, UpdateTodoParameters>;
    deleteTodoMutation: UseMutationType<object, DeleteTodoParameters>;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const previousValue = useRef<BaseTodo>(todo);

    const isChecked = useWatch({
      control,
      name: `todos.${index}.is_checked` as const
    });
    const title = useWatch({
      control,
      name: `todos.${index}.title` as const
    });
    const { isPersisted, _id: todoId } = todo;

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

    return (
      <HStack spacing={2}>
        {isEditing || !isPersisted ? (
          <>
            <Checkbox {...register(`todos.${index}.is_checked` as const)} />

            <FormControl>
              <Input
                type="text"
                {...register(`todos.${index}.title` as const)}
                value={title}
              />

              {errors[index]?.title && (
                <FormHelperText>{errors[index]?.title}</FormHelperText>
              )}
            </FormControl>

            <IconButton
              colorScheme="teal"
              onClick={onSave}
              aria-label="Save"
              icon={<CheckIcon />}
            />
          </>
        ) : (
          <>
            <Checkbox onChange={onChangeTick} isChecked={isChecked}>
              {todo.title}
            </Checkbox>

            <IconButton
              colorScheme="teal"
              onClick={() => setIsEditing(true)}
              aria-label="Edit"
              icon={<EditIcon />}
            />
          </>
        )}
      </HStack>
    );
  }
);

interface MutateContext {
  previousRoom: BaseRoom;
}

function useMutateRoom<R, T>(
  mutationFn: MutationFunction<ApiResponse<R>, T>,
  onMutate: (
    variables: T
  ) => Promise<undefined> | MutateContext | Promise<MutateContext>
) {
  const queryClient = useQueryClient();

  return useMutation(mutationFn, {
    onMutate,
    // If the mutation fails, use the context returned from onMutate to roll back.
    onError: (_err, _variables, context) => {
      if (context?.previousRoom) {
        queryClient.setQueryData<BaseRoom>('room', context.previousRoom);
      }
    },
    // Always refetch after error or success.
    onSettled: () => {
      queryClient.invalidateQueries('room');
    }
  });
}

function resolveExistingTodos(todos: BaseTodo[]): BaseTodo[] {
  return todos.map((todo) => ({
    _id: generateHash(),
    isPersisted: true,
    ...todo
  }));
}
