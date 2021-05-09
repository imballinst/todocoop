import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';

export interface ApiResponse<T> {
  data?: T;
  errors?: ErrorObject[];
}

export interface ErrorObject {
  code: string;
  message: string;
}

export interface Dictionary<T> {
  [index: string]: T;
}

export interface ExtendedNextApiRequest extends NextApiRequest {
  session: Session;
}

export type NextHandler = (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => void;
