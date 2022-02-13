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
import { AxiosError } from 'axios';
import { useToast } from '@chakra-ui/react';

import {
  createTodo,
  deleteTodo,
  getCurrentRoom,
  updateTodo
} from './query/rooms';
import { Room } from '../models';
import { ApiResponse } from '../server/types';
import { BaseRoom } from '../models/types';
import { getErrorMessage, replaceArrayElementAtIndex } from '../utils';

interface Params {
  redirectToIfOutsideRoom?: string;
  redirectToIfInsideRoom?: string;
  queryOptions?: UseQueryOptions<Room, unknown, Room, 'room'>;
}

type PickedUseQueryFields = Pick<
  ReturnType<typeof useQuery>,
  'refetch' | 'isFetching'
>;

type UseCurrentRoomType = {
  room: Room | undefined;
  refetchRoom: PickedUseQueryFields['refetch'];
  isFetching: PickedUseQueryFields['isFetching'];
};

const DEFAULT_QUERY_OPTIONS = {
  retry: false,
  retryOnMount: false,
  cacheTime: 10000,
  staleTime: 10000
};

export function useCurrentRoom({
  redirectToIfInsideRoom = '',
  redirectToIfOutsideRoom = '',
  queryOptions
}: Params = {}): UseCurrentRoomType {
  const {
    data: room,
    refetch: refetchRoom,
    isFetching,
    isFetched
  } = useQuery(
    'room',
    async () => {
      try {
        const json = await getCurrentRoom();
        const data = json.data;

        return {
          _id: data._id,
          __v: data.__v,
          name: data.name,
          password: data.password,
          todos: data.todos.map((todo) => ({
            _id: todo._id,
            localId: todo.localId,
            isChecked: todo.isChecked,
            title: todo.title
          }))
        } as Room;
      } catch (err) {
        console.error(err);

        return undefined;
      }
    },
    { ...DEFAULT_QUERY_OPTIONS, ...(queryOptions || {}) }
  );

  useEffect(() => {
    // If no redirect needed, just return (example: already on /dashboard).
    // If room data not yet there (fetch in progress, logged in or not) then don't do anything yet.
    if (!room && isFetched) {
      if (!redirectToIfOutsideRoom) return;

      Router.push(redirectToIfOutsideRoom);
      return;
    }

    // If `redirectIfInsideARoom` is set and the user is inside a room, redirect if the room was found.
    if (redirectToIfInsideRoom && room) {
      Router.push(redirectToIfInsideRoom);
    }
  }, [room, isFetched, redirectToIfOutsideRoom, redirectToIfInsideRoom]);

  return { room, refetchRoom, isFetching };
}

// Mutations for react-query.
interface MutateContext {
  previousRoom: BaseRoom;
}

export function useMutateRoom<R, T>({
  mutationFn,
  onMutate,
  errorTitle,
  onSettled
}: {
  mutationFn: MutationFunction<ApiResponse<R>, T>;
  onMutate: (
    variables: T
  ) => Promise<undefined> | MutateContext | Promise<MutateContext>;
  errorTitle: string;
  onSettled?: () => void;
}) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation(mutationFn, {
    onMutate,
    // If the mutation fails, use the context returned from onMutate to roll back.
    onError: async (err: AxiosError, _variables, context) => {
      const error = getErrorMessage(err);
      toast({
        title: errorTitle,
        description: error,
        status: 'error'
      });

      if (context?.previousRoom) {
        queryClient.setQueryData<BaseRoom>('room', context.previousRoom);
      }
    },
    // Always refetch after error or success.
    onSettled: () => {
      if (onSettled) {
        onSettled();
      }

      queryClient.invalidateQueries('room');
    }
  });
}

// Source: https://react-query.tanstack.com/examples/optimistic-updates-typescript.
export function useCreateTodo(mutationFn = createTodo) {
  const queryClient = useQueryClient();

  return useMutateRoom({
    mutationFn,
    onMutate: async ({ todo: newTodo }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries('room');

      // Snapshot the previous value.
      const previousRoom = queryClient.getQueryData<BaseRoom>('room');

      // Optimistically update to the new value.
      if (previousRoom) {
        const newPersistedTodo = {
          _id: newTodo._id,
          localId: newTodo.localId,
          isPersisted: true,
          isChecked: newTodo.isChecked,
          title: newTodo.title
        };

        queryClient.setQueryData<BaseRoom>('room', {
          ...previousRoom,
          todos: [...previousRoom.todos, newPersistedTodo]
        });
      }

      return { previousRoom };
    },
    errorTitle: 'Failed to add todo'
  });
}

export function useUpdateTodo(mutationFn = updateTodo) {
  const queryClient = useQueryClient();

  return useMutateRoom({
    mutationFn,
    onMutate: async ({ todo: updatedTodo }) => {
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
    },
    errorTitle: 'Failed to update todo'
  });
}

export function useDeleteTodo(mutationFn = deleteTodo) {
  const queryClient = useQueryClient();

  return useMutateRoom({
    mutationFn,
    onMutate: async ({ todoId }) => {
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
    },
    errorTitle: 'Failed to delete todo'
  });
}
