import { QueryClient, QueryClientProvider } from 'react-query';

import Link from 'next/link';
import { useState } from 'react';
import { Room } from '../models';
import AccessRoom from './AccessRoom';

function IndexPage() {
  const [room, setRoom] = useState<Room | undefined>(undefined);

  return (
    <>
      <h1>Hello Next.js 👋</h1>

      {room === undefined ? <AccessRoom onSuccessfulAccess={setRoom} /> : null}
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
