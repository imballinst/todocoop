import axios from 'axios';

import { ApiResponse } from '../../types';
import { Room, Todo } from '../../models';

interface RoomParameters {
  name: string;
  password: string;
}

export async function createRoom(
  params: RoomParameters
): Promise<ApiResponse<Room>> {
  return axios.post(`/api/rooms`, {
    json: params
  });
}

export async function accessRoom({
  name,
  password
}: RoomParameters): Promise<ApiResponse<Room>> {
  return axios.post(`/api/rooms/${name}/access`, {
    json: {
      password
    }
  });
}

// Todos.
interface TodoParameters {
  name: string;
  todo: Todo;
}

export async function createTodo({
  name,
  todo
}: TodoParameters): Promise<ApiResponse<Todo>> {
  return axios.post(`/api/rooms/${name}/todos`, {
    json: todo
  });
}

interface UpdateTodoParameters {
  name: string;
  todoId: string;
  todo: Todo;
}

export async function updateTodo({
  name,
  todoId,
  todo
}: UpdateTodoParameters): Promise<ApiResponse<Todo>> {
  return axios.put(`/api/rooms/${name}/todos/${todoId}`, {
    json: todo
  });
}

interface DeleteTodoParameters {
  name: string;
  todoId: string;
}

export async function deleteTodo({
  name,
  todoId
}: DeleteTodoParameters): Promise<ApiResponse<Todo>> {
  return axios.delete(`/api/rooms/${name}/todos/${todoId}`);
}
