import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions
} from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

import {
  getCurrentRoom,
  syncTodos,
  type SyncTodoParameters
} from './query/rooms';
import type { BaseRoom, UiRoom, UiTodo } from '../models/types';
import { getErrorMessage } from '../utils';
import { mergeTodos } from '../todos';
import type { ApiResponse } from '../server/api';
import { toaster } from '../../components/Toaster';

interface Params {
  redirectToIfOutsideRoom?: string;
  redirectToIfInsideRoom?: string;
  queryOptions?: Omit<
    UseQueryOptions<UiRoom | null>,
    'queryKey' | 'queryFn'
  >;
}

type UseCurrentRoomType = {
  room: UiRoom | undefined;
  refetchRoom: () => void;
  isFetching: boolean;
};

const DEFAULT_QUERY_OPTIONS = {
  retry: false,
  retryOnMount: false,
  gcTime: 10000,
  staleTime: 10000
};

export function useCurrentRoom({
  redirectToIfInsideRoom = '',
  redirectToIfOutsideRoom = '',
  queryOptions
}: Params = {}): UseCurrentRoomType {
  const navigate = useNavigate();
  const {
    data,
    refetch: refetchRoom,
    isFetching,
    isFetched
  } = useQuery<UiRoom | null>({
    queryKey: ['room'],
    queryFn: async () => {
      try {
        const json = await getCurrentRoom();
        const data = json.data.data;

        if (!data) return null;

        return {
          _id: data._id,
          __v: data.__v,
          name: data.name,
          password: data.password,
          todos: data.todos.map((todo) => ({
            ...todo,
            state: 'unmodified' as const
          }))
        } as UiRoom;
      } catch (err) {
        console.error(err);

        return null;
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
    ...(queryOptions || {})
  });

  const room = data ?? undefined;

  useEffect(() => {
    // If no redirect needed, just return (example: already on /dashboard).
    // If room data not yet there (fetch in progress, logged in or not) then don't do anything yet.
    if (!room && isFetched) {
      if (!redirectToIfOutsideRoom) return;

      navigate(redirectToIfOutsideRoom);
      return;
    }

    // If `redirectIfInsideARoom` is set and the user is inside a room, redirect if the room was found.
    if (redirectToIfInsideRoom && room) {
      navigate(redirectToIfInsideRoom);
    }
  }, [
    room,
    isFetched,
    redirectToIfOutsideRoom,
    redirectToIfInsideRoom,
    navigate
  ]);

  return { room, refetchRoom, isFetching };
}

// Mutations for react-query.
interface UseSyncRoomParameters {
  mutationFn?: typeof syncTodos;
  onSettled?: (data: BaseRoom) => void;
}

interface SyncRoomContext {
  previousRoom: UiRoom | undefined;
}

export function useSyncRoom(
  { mutationFn = syncTodos, onSettled }: UseSyncRoomParameters = {
    mutationFn: syncTodos
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async ({ todos }: SyncTodoParameters) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries({ queryKey: ['room'] });

      // Snapshot the previous value.
      const previousRoom = queryClient.getQueryData<UiRoom>(['room']);

      // Optimistically update to the new value.
      if (previousRoom) {
        queryClient.setQueryData<UiRoom>(['room'], {
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
      }

      return { previousRoom } satisfies SyncRoomContext;
    },
    // If the mutation fails, use the context returned from onMutate to roll back.
    onError: (err, _variables, context) => {
      toaster.create({
        title: 'Failed to sync todos',
        description: getErrorMessage(err),
        type: 'error'
      });

      if (context?.previousRoom !== undefined) {
        queryClient.setQueryData<UiRoom>(['room'], context.previousRoom);
      }
    },
    // Always refetch after error or success.
    onSettled: (
      data: AxiosResponse<ApiResponse<BaseRoom>> | undefined
    ) => {
      if (onSettled && data) {
        onSettled(data.data.data);
      }

      queryClient.invalidateQueries({ queryKey: ['room'] });
    }
  });
}
