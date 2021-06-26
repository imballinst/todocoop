import { Document } from 'mongoose';

type MongoToObjectFields = Pick<Document, '_id' | '__v'>;

// Todo.
export interface BaseTodo extends MongoToObjectFields {
  // Mongo fields.
  title: string;
  isChecked: boolean;
  // UI fields.
  isPersisted?: boolean;
  localId?: string;
}

// Room.
export interface BaseRoom extends MongoToObjectFields {
  name: string;
  password: string;
  todos: BaseTodo[];
}
