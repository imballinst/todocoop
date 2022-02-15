import { NextApiRequest, NextApiResponse } from 'next';
import { IronSession } from 'iron-session';
import { ErrorObject } from '../types';

export interface ApiResponse<T> {
  data?: T;
  errors?: ErrorObject[];
}

export interface ExtendedNextApiRequest extends NextApiRequest {
  session: IronSession & {
    roomId?: string;
  };
}

export type NextHandler = (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => void;
