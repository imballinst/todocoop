import { model, Schema, Document, Model, models } from 'mongoose';

// Todo.
export interface Todo {
  title: string;
  is_checked: boolean;
}
export interface TodoDocument extends Todo, Document {}

const TodoSchema = new Schema<TodoDocument>({
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
export interface Room {
  name: string;
  password: string;
  todos: TodoDocument[];
}
export interface RoomDocument extends Room, Document {}

const RoomSchema = new Schema<RoomDocument>({
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

export const TodoModel: Model<TodoDocument, {}> =
  models.Todo || model<TodoDocument>('Todo', TodoSchema);
export const RoomModel: Model<RoomDocument, {}> =
  models.Room || model<RoomDocument>('Room', RoomSchema);
