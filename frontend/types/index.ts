import { NextApiRequest, NextApiResponse } from 'next';

export interface ApiResponse {
  data?: any;
  errors?: ErrorObject[];
}

export interface ErrorObject {
  code: string;
  message: string;
}

export interface Dictionary<T> {
  [index: string]: T;
}

export type NextHandler = (req: NextApiRequest, res: NextApiResponse) => void;
