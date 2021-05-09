import axios from 'axios';

import { ApiResponse } from '../../types';
import { Room, Todo } from '../../models';

export interface CreateRoomParameters {
  name: string;
  password: string;
}

export async function createRoom(
  params: CreateRoomParameters
): Promise<ApiResponse<Room>> {
  return axios.post(`/api/rooms`, params);
}

export interface AccessRoomParameters extends CreateRoomParameters {}

export async function accessRoom({
  name,
  password
}: AccessRoomParameters): Promise<ApiResponse<Room>> {
  return axios.post(`/api/rooms/${name}/access`, {
    password
  });
}

export async function leaveRoom({
  name
}: {
  name: string;
}): Promise<ApiResponse<undefined>> {
  return axios.post(`/api/rooms/${name}/leave`);
}

export async function getCurrentRoom(): Promise<ApiResponse<Room>> {
  return axios.get(`/api/current-room`);
}

// Todos.
export interface TodoParameters {
  name: string;
  todo: Todo;
}

export async function createTodo({
  name,
  todo
}: TodoParameters): Promise<ApiResponse<Todo>> {
  return axios.post(`/api/rooms/${name}/todos`, todo);
}

export interface UpdateTodoParameters {
  name: string;
  todoId: string;
  todo: Todo;
}

export async function updateTodo({
  name,
  todoId,
  todo
}: UpdateTodoParameters): Promise<ApiResponse<Todo>> {
  return axios.put(`/api/rooms/${name}/todos/${todoId}`, todo);
}

export interface DeleteTodoParameters {
  name: string;
  todoId: string;
}

export async function deleteTodo({
  name,
  todoId
}: DeleteTodoParameters): Promise<ApiResponse<Todo>> {
  return axios.delete(`/api/rooms/${name}/todos/${todoId}`);
}
