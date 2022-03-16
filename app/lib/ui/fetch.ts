import { ApiResponse } from '../server/types';
import { BaseRoom, BaseTodo } from '../models/types';

export interface CreateRoomParameters {
  name: string;
  password: string;
}

export async function createRoom(params: CreateRoomParameters) {
  return doFetch<ApiResponse<BaseRoom>>(`/api/rooms`, {
    body: JSON.stringify(params),
    method: 'post'
  });
}

export interface AccessRoomParameters extends CreateRoomParameters {}

export async function accessRoom({ name, password }: AccessRoomParameters) {
  return doFetch<ApiResponse<BaseRoom>>(`/api/rooms/${name}/access`, {
    body: JSON.stringify({ password }),
    method: 'post'
  });
}

export async function leaveRoom({
  name
}: {
  name: string;
}): Promise<ApiResponse<object>> {
  return doFetch<object>(`/api/rooms/${name}/leave`, { method: 'post' });
}

export async function getCurrentRoom() {
  return doFetch<ApiResponse<BaseRoom>>(`/api/current-room`);
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
  return doFetch<ApiResponse<BaseRoom>>(`/api/rooms/${name}/sync-todos`, {
    body: JSON.stringify(todos),
    method: 'post'
  });
}

// Fetch helpers.
async function doFetch<T>(url: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const errorMessage = await getResponseErrorMessage(response);
    throw new Error(errorMessage);
  }

  return response.json();
}

async function getResponseErrorMessage(response: Response) {
  if (response.headers.get('content-type') === 'application/json') {
    const json = await response.json();
    return json.errors.map((el: any) => el.message).join('; ');
  }

  return response.statusText;
}
