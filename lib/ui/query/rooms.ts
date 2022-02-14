import axios from 'axios';

import { ApiResponse } from '../../server/types';
import { BaseRoom } from '../../models/types';
import { Room } from '../../models';

export interface CreateRoomParameters {
  name: string;
  password: string;
}

export async function createRoom(
  params: CreateRoomParameters
): Promise<ApiResponse<BaseRoom>> {
  return axios.post(`/api/rooms`, params);
}

export interface AccessRoomParameters extends CreateRoomParameters {}

export async function accessRoom({
  name,
  password
}: AccessRoomParameters): Promise<ApiResponse<BaseRoom>> {
  return axios.post(`/api/rooms/${name}/access`, {
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

export async function getCurrentRoom(): Promise<ApiResponse<BaseRoom>> {
  return axios.get(`/api/current-room`);
}

// Todos.
export interface SyncTodoParameters {
  room: Room;
}

export async function syncTodos({ room }): Promise<ApiResponse<Room>> {
  return axios.post(`/api/rooms/${room.name}/sync-todos`, room);
}
