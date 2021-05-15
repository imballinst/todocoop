// Source: https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/useUser.js.
// With some modification.
import { useEffect } from 'react';
import Router from 'next/router';
import { useQuery, UseQueryOptions } from 'react-query';

import { getCurrentRoom } from '../pages/query/rooms';
import { Room } from '../models';

interface Params {
  redirectTo?: string;
  redirectIfInsideARoom?: boolean;
  queryOptions?: UseQueryOptions<Room, unknown, Room, 'room'>;
}

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
