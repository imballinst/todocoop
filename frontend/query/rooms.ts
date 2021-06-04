import axios from 'axios';

import { ApiResponse } from '../types';
import { BaseRoom, BaseTodo } from '../types/models';

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
export interface TodoParameters {
  name: string;
  todo: Partial<BaseTodo>;
}

export async function createTodo({
  name,
  todo
}: TodoParameters): Promise<ApiResponse<BaseTodo>> {
  return axios.post(`/api/rooms/${name}/todos`, todo);
}

export interface UpdateTodoParameters {
  name: string;
  todo: BaseTodo;
}

export async function updateTodo({
  name,
  todo
}: UpdateTodoParameters): Promise<ApiResponse<BaseTodo>> {
  return axios.put(`/api/rooms/${name}/todos/${todo._id}`, todo);
}

export interface DeleteTodoParameters {
  name: string;
  todoId: string;
}

export async function deleteTodo({
  name,
  todoId
}: DeleteTodoParameters): Promise<ApiResponse<object>> {
  return axios.delete(`/api/rooms/${name}/todos/${todoId}`);
}
