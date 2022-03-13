import { Document } from 'mongoose';

type MongoToObjectFields = Pick<Document, '_id' | '__v'>;

// Todo.
export interface BaseTodo extends MongoToObjectFields {
  // Mongo fields.
  title: string;
  isChecked: boolean;
  indexOrder: number;
  updatedAt: string;
  localId: string;
}

export interface UiTodo extends BaseTodo {
  state: 'added' | 'modified' | 'unmodified';
}

// Room.
export interface BaseRoom extends MongoToObjectFields {
  name: string;
  password: string;
  todos: BaseTodo[];
}

export interface UiRoom extends MongoToObjectFields {
  name: string;
  password: string;
  todos: UiTodo[];
}
