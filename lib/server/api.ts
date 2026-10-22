export interface ErrorObject {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  errors?: ErrorObject[];
}
