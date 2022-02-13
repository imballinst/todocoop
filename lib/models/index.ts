import { model, Schema, Document, Model, models } from 'mongoose';

import { BaseRoom, BaseTodo } from './types';

// Todo.
export interface Todo extends BaseTodo, Document {}

const TodoSchema = new Schema<Todo>(
  {
    title: {
      type: String,
      required: [true, 'Todo title is required.']
    },
    localId: {
      type: String,
      required: true
    },
    isChecked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Room.
export interface Room extends BaseRoom, Document {
  todos: Todo[];
}

const RoomSchema = new Schema<Room>(
  {
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
  },
  {
    timestamps: true
  }
);

export const TodoModel: Model<Todo, {}> =
  models.Todo || model<Todo>('Todo', TodoSchema);
export const RoomModel: Model<Room, {}> =
  models.Room || model<Room>('Room', RoomSchema);
