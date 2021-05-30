// Source: https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/useUser.js.
// With some modification.
import { useEffect } from 'react';
import Router from 'next/router';
import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from 'react-query';

import {
  createTodo,
  deleteTodo,
  getCurrentRoom,
  updateTodo
} from '../pages/query/rooms';
import { Room } from '../models';
import { ApiResponse } from '../types';
import { BaseRoom } from '../types/models';
import { replaceArrayElementAtIndex } from './utils';

interface Params {
  redirectTo?: string;
  redirectIfInsideARoom?: boolean;
  queryOptions?: UseQueryOptions<Room, unknown, Room, 'room'>;
}

export type UseCurrentRoomType = ReturnType<typeof useCurrentRoom>;

const DEFAULT_QUERY_OPTIONS = {
  retry: false,
  retryOnMount: false
};

export function useCurrentRoom({
  redirectTo = '',
  redirectIfInsideARoom = false,
  queryOptions
}: Params = {}) {
  const { data: room, refetch: refetchRoom } = useQuery(
    'room',
    async () => {
      const json = await getCurrentRoom();
      const data = json.data;

      return {
        _id: data._id,
        __v: data.__v,
        name: data.name,
        password: data.password,
        todos: data.todos.map((todo) => ({
          _id: todo._id,
          is_checked: todo.is_checked,
          title: todo.title
        }))
      } as Room;
    },
    { ...DEFAULT_QUERY_OPTIONS, ...(queryOptions || {}) }
  );

  useEffect(() => {
    // If no redirect needed, just return (example: already on /dashboard).
    // If room data not yet there (fetch in progress, logged in or not) then don't do anything yet.
    if (!redirectTo || !room) return;

    if (
      // If `redirectTo` is set, redirect if the room was not found.
      (redirectTo && !redirectIfInsideARoom && !room) ||
      // If `redirectIfInsideARoom` is also set, redirect if the room was found.
      (redirectIfInsideARoom && room)
    ) {
      Router.push(redirectTo);
    }
  }, [room, redirectIfInsideARoom, redirectTo]);

  return { room, refetchRoom };
}

// Mutations for react-query.
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

// Source: https://react-query.tanstack.com/examples/optimistic-updates-typescript.
export function useRoomMutations() {
  const queryClient = useQueryClient();

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

  return {
    addTodoMutation,
    updateTodoMutation,
    deleteTodoMutation
  };
}