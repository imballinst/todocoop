import {
  FormState,
  useFieldArray,
  useForm,
  UseFormRegister
} from 'react-hook-form';
import {
  MutationFunction,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient
} from 'react-query';
import { useCurrentRoom } from '../lib/useCurrentRoom';
import { generateHash, replaceArrayElementAtIndex } from '../lib/utils';
import { ApiResponse } from '../types';
import { BaseTodo, BaseRoom } from '../types/models';
import { createTodo, deleteTodo, updateTodo } from './query/rooms';

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

  // Source: https://react-query.tanstack.com/examples/optimistic-updates-typescript.
  const addTodoMutation = useMutateRoom(
    (newTodo) => createTodo({ name, todo: newTodo }),
    async (newTodo: BaseTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries('room');

      // Snapshot the previous value.
      const previousRoom = queryClient.getQueryData<BaseRoom>('room');

      // Optimistically update to the new value.
      if (previousRoom) {
        queryClient.setQueryData<BaseRoom>('room', {
          ...previousRoom,
          todos: [...previousRoom.todos, newTodo]
        });
      }

      return { previousRoom };
    }
  );

  const updateTodoMutation = useMutateRoom(
    (updatedTodo) =>
      updateTodo({
        name,
        todo: updatedTodo
      }),
    async (updatedTodo: BaseTodo) => {
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

  const deleteTodoMutation = useMutateRoom(
    (deletedTodo) => deleteTodo({ name, todoId: deletedTodo._id }),
    async (deletedTodo: BaseTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries('room');

      // Snapshot the previous value.
      const previousRoom = queryClient.getQueryData<BaseRoom>('room');

      // Optimistically update to the new value.
      if (previousRoom) {
        const idx = previousRoom.todos.findIndex(
          (el) => el._id === deletedTodo._id
        );

        queryClient.setQueryData<BaseRoom>('room', {
          ...previousRoom,
          todos: replaceArrayElementAtIndex(previousRoom.todos, idx, undefined)
        });
      }

      return { previousRoom };
    }
  );

  const {
    control,
    register,
    formState: { errors },
    getValues,
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
    keyName: 'todos'
  });

  function onTodoCreated(title: string) {}

  function onTodoUpdated() {}

  function onTodoDeleted() {}

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
                register={register}
                remove={remove}
                todo={todo}
                addTodoMutation={addTodoMutation}
                updateTodoMutation={updateTodoMutation}
                deleteTodoMutation={deleteTodoMutation}
              />
            </li>
          ))}

          <li>
            <button
            // onClick={() =>
            //   append({
            //     __id: generateHash(),
            //     is_checked: false,
            //     title: ''
            //   })
            // }
            >
              Add
            </button>
          </li>
        </ol>
      </div>
    </form>
  );
}

// Helper functions/components.
function TodoForm({
  roomName,
  todo,
  errors,
  register,
  remove,
  index
}: {
  roomName: string;
  todo: BaseTodo;
  errors: FormState<RoomFormState>['errors'];
  register: UseFormRegister<RoomFormState>;
  remove: (index: number) => void;
  index: number;
  // Mutate handlers.
  addTodoMutation: UseMutationResult<
    ApiResponse<BaseTodo>,
    unknown,
    BaseTodo,
    MutateContext
  >;
  updateTodoMutation: UseMutationResult<
    ApiResponse<BaseTodo>,
    unknown,
    BaseTodo,
    MutateContext
  >;
  deleteTodoMutation: UseMutationResult<
    ApiResponse<object>,
    unknown,
    BaseTodo,
    MutateContext
  >;
}) {
  async function onCreateTodo() {
    const response = await createTodo({
      name: roomName,
      todo: {
        title: todo.title,
        is_checked: todo.is_checked
      }
    });
  }

  return (
    <>
      <label htmlFor="title">{todo.title}</label>
      <input
        id="title"
        aria-invalid={errors[index].title !== undefined}
        {...register(`todos.${index}.is_checked` as const, {
          minLength: 1
        })}
      />
      {errors[index].title && <span role="alert">{errors[index].title}</span>}

      <button onClick={() => remove(index)}>Remove</button>
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
