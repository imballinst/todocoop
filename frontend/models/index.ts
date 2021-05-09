import { model, Schema, Document } from 'mongoose';

// Todo.
export interface Todo extends Document {
  title: string;
  is_checked: boolean;
}

const TodoSchema = new Schema<Todo>({
  title: {
    type: String,
    unique: true,
    required: true
  },
  is_checked: {
    type: Boolean,
    default: false
  }
});

// Room.
export interface Room extends Document {
  name: string;
  password: string;
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
  todos: [TodoSchema]
});

export const TodoModel = model<Todo>('Todo', TodoSchema);
export const RoomModel = model<Room>('Room', RoomSchema);
