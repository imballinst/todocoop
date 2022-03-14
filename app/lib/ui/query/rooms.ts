import axios from 'axios';

import { ApiResponse } from '../../server/types';
import { BaseRoom, BaseTodo } from '../../models/types';

export interface CreateRoomParameters {
  name: string;
  password: string;
}

export async function createRoom(params: CreateRoomParameters) {
  return axios.post<ApiResponse<BaseRoom>>(`/api/rooms`, params);
}

export interface AccessRoomParameters extends CreateRoomParameters {}

export async function accessRoom({ name, password }: AccessRoomParameters) {
  return axios.post<ApiResponse<BaseRoom>>(`/api/rooms/${name}/access`, {
    password
  });
}

export async function leaveRoom({
  name
}: {
  name: string;
}): Promise<ApiResponse<object>> {
  return axios.post(`/api/rooms/${name}/leave`);
}

export async function getCurrentRoom() {
  return axios.get<ApiResponse<BaseRoom>>(`/api/current-room`);
}

// Todos.
export interface SyncTodoParameters {
  name: string;
  todos: {
    added: BaseTodo[];
    modified: BaseTodo[];
    removed: BaseTodo[];
  };
}

export async function syncTodos({ name, todos }: SyncTodoParameters) {
  return axios.post<ApiResponse<BaseRoom>>(
    `/api/rooms/${name}/sync-todos`,
    todos
  );
}
