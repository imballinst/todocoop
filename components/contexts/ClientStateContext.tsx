import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { createCtx } from './common';

interface ClientStateContext {
  isAccessingRoom: boolean;
  setIsAccessingRoom: Dispatch<SetStateAction<boolean>>;
}

const [useCtx, Provider] = createCtx<ClientStateContext>();
export const useClientState = useCtx;

export function ClientStateProvider({ children }: { children: ReactNode }) {
  const [isAccessingRoom, setIsAccessingRoom] = useState(false);

  return (
    <Provider value={{ isAccessingRoom, setIsAccessingRoom }}>
      {children}
    </Provider>
  );
}
