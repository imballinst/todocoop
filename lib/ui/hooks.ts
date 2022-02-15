// Source: https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/useUser.js.
// With some modification.
import { useEffect } from 'react';
import Router from 'next/router';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useToast } from '@chakra-ui/react';

import { getCurrentRoom, SyncTodoParameters, syncTodos } from './query/rooms';
import { BaseRoom, UiRoom, UiTodo } from '../models/types';
import { getErrorMessage } from '../utils';
import { mergeTodos } from '../todos';
import { ApiResponse } from '../server/types';

interface Params {
  redirectToIfOutsideRoom?: string;
  redirectToIfInsideRoom?: string;
  queryOptions?: UseQueryOptions<UiRoom, unknown, UiRoom, 'room'>;
}

type PickedUseQueryFields = Pick<
  ReturnType<typeof useQuery>,
  'refetch' | 'isFetching'
>;

type UseCurrentRoomType = {
  room: UiRoom | undefined;
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
        const data = json.data.data;

        return {
          _id: data._id,
          __v: data.__v,
          name: data.name,
          password: data.password,
          todos: data.todos.map((todo) => ({
            ...todo,
            state: 'unmodified'
          }))
        } as UiRoom;
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
interface UseSyncRoomParameters {
  mutationFn?: typeof syncTodos;
  onSettled?: (data: BaseRoom) => void;
}

export function useSyncRoom(
  { mutationFn = syncTodos, onSettled }: UseSyncRoomParameters | undefined = {
    mutationFn: syncTodos
  }
) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation(mutationFn, {
    onMutate: async ({ todos }: SyncTodoParameters) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries('room');

      // Snapshot the previous value.
      const previousRoom = queryClient.getQueryData<UiRoom>('room');

      // Optimistically update to the new value.
      queryClient.setQueryData<UiRoom>('room', {
        ...previousRoom,
        todos: mergeTodos({
          base: previousRoom.todos,
          added: todos.added,
          modified: todos.modified,
          removed: todos.removed
        }).map(
          (todo, idx): UiTodo => ({
            ...todo,
            indexOrder: idx,
            state: 'unmodified'
          })
        )
      });

      return { previousRoom };
    },
    // If the mutation fails, use the context returned from onMutate to roll back.
    onError: async (err: AxiosError, _variables, context) => {
      const error = getErrorMessage(err);
      toast({
        title: 'Failed to sync todos',
        description: error,
        status: 'error'
      });

      if (context?.previousRoom !== undefined) {
        queryClient.setQueryData('room', context.previousRoom);
      }
    },
    // Always refetch after error or success.
    onSettled: (data) => {
      if (onSettled && data) {
        onSettled(data?.data?.data);
      }

      queryClient.invalidateQueries('room');
    }
  });
}
