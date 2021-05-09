// Source: https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/useUser.js.
// With some modification.
import { useEffect } from 'react';
import Router from 'next/router';
import { useQuery } from 'react-query';

import { getCurrentRoom } from '../pages/query/rooms';

interface Params {
  redirectTo?: string;
  redirectIfInsideARoom?: boolean;
}

export function useCurrentRoom({
  redirectTo = '',
  redirectIfInsideARoom = false
}: Params = {}) {
  const { data: room, refetch: refetchRoom } = useQuery(
    'room',
    async () => {
      const json = await getCurrentRoom();
      return json.data;
    },
    {
      refetchInterval: false
    }
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
