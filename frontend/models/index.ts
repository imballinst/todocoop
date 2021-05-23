import { model, Schema, Document, Model, models } from 'mongoose';

import { BaseRoom, BaseTodo } from '../types/models';

// Todo.
export interface Todo extends BaseTodo, Document {}

const TodoSchema = new Schema<Todo>({
  title: {
    type: String,
    required: true
  },
  is_checked: {
    type: Boolean,
    default: false
  }
});

// Room.
export interface Room extends BaseRoom, Document {
  todos: Todo[];
}

const RoomSchema = new Schema<Room>({
  name: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  todos: {
    type: [TodoSchema],
    default: []
  }
});

export const TodoModel: Model<Todo, {}> =
  models.Todo || model<Todo>('Todo', TodoSchema);
export const RoomModel: Model<Room, {}> =
  models.Room || model<Room>('Room', RoomSchema);
