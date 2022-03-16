import { ErrorObject } from '../types';

export interface ApiResponse<T> {
  data?: T;
  errors?: ErrorObject[];
}
