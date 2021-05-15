import { useEffect, useRef } from 'react';
import {
  Control,
  FieldArrayMethodProps,
  FormState,
  useFieldArray,
  useForm,
  UseFormRegister,
  useWatch
} from 'react-hook-form';
import {
  MutationFunction,
  useMutation,
  UseMutationResult,
  useQueryClient
} from 'react-query';
import { useCurrentRoom } from '../lib/useCurrentRoom';
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
  const { room: roomData } = useCurrentRoom({
    queryOptions: {
      refetchInterval: 10000
    }
  });

  const {
    control,
    register,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      todos: todos.map((todo) => ({
        _id: generateHash(),
        ...todo
      }))
    } as RoomFormState
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'todos',
    keyName: 'key'
  });

  useEffect(() => {
    reset(roomData);
  }, [roomData]);

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
        append(newPersistedTodo);
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
      remove(idx);
    }

    return { previousRoom };
  });

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <h1>{name}</h1>
        <ol>
          {fields.map((todo, index) => (
            <li>
              <TodoForm
                roomName={name}
                errors={errors}
                index={index}
                isLast={index === fields.length}
                register={register}
                todo={todo}
                append={append}
                control={control}
                addTodoMutation={addTodoMutation}
                updateTodoMutation={updateTodoMutation}
                deleteTodoMutation={deleteTodoMutation}
              />
            </li>
          ))}

          <li>
            <button
              onClick={() =>
                append({
                  is_checked: false,
                  title: ''
                })
              }
            >
              Add
            </button>
          </li>
        </ol>
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
function TodoForm({
  roomName,
  todo,
  errors,
  register,
  append,
  control,
  index,
  isLast,
  addTodoMutation,
  updateTodoMutation,
  deleteTodoMutation
}: {
  roomName: string;
  todo: BaseTodo;
  errors: FormState<RoomFormState>['errors'];
  register: UseFormRegister<RoomFormState>;
  append: (
    value: Partial<BaseTodo> | Partial<BaseTodo>[],
    options?: FieldArrayMethodProps
  ) => void;
  control: Control<RoomFormState>;
  index: number;
  isLast: boolean;
  // Mutate handlers.
  addTodoMutation: UseMutationType<BaseTodo, TodoParameters>;
  updateTodoMutation: UseMutationType<BaseTodo, UpdateTodoParameters>;
  deleteTodoMutation: UseMutationType<object, DeleteTodoParameters>;
}) {
  const isChecked = useWatch({
    control,
    name: `todos.${index}.is_checked` as const
  });
  const title = useWatch({
    control,
    name: `todos.${index}.title` as const
  });
  const { isPersisted, _id: todoId } = todo;

  function onBlur() {
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
  }

  function onDelete() {
    deleteTodoMutation.mutate({ name: roomName, todoId: todo._id });
  }

  return (
    <>
      <input
        id="is_checked"
        type="checkbox"
        aria-invalid={errors[index]?.is_checked !== undefined}
        {...register(`todos.${index}.is_checked` as const, {
          minLength: 1
        })}
      />

      <input
        id="title"
        aria-invalid={errors[index]?.title !== undefined}
        {...register(`todos.${index}.title` as const, {
          minLength: 1
        })}
      />
      {errors[index]?.title && <span role="alert">{errors[index]?.title}</span>}

      <button onClick={onDelete}>Remove</button>
    </>
  );
}

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
