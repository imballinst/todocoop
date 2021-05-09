import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider
} from 'react-query';

import Link from 'next/link';
import { useEffect } from 'react';
import { accessRoom } from './query/rooms';

function IndexPage() {
  const query = useQuery('todos', () => {
    return accessRoom({
      name: 'test',
      password: 'test'
    });
  });

  return (
    <>
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IndexPage />
    </QueryClientProvider>
  );
}
