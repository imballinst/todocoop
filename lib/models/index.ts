import mongoose from 'mongoose';
import type { Model } from 'mongoose';

import type { BaseRoom, BaseTodo } from './types';

const { model, models, Schema } = mongoose;

// Todo.
const TodoSchema = new Schema<BaseTodo>({
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
  },
  updatedAt: {
    type: String
  },
  indexOrder: {
    type: Number
  }
});

// Room.
const RoomSchema = new Schema<BaseRoom>(
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

export const TodoModel: Model<BaseTodo> =
  (models.Todo as Model<BaseTodo>) || model<BaseTodo>('Todo', TodoSchema);
export const RoomModel: Model<BaseRoom> =
  (models.Room as Model<BaseRoom>) || model<BaseRoom>('Room', RoomSchema);
