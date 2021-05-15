import { Document } from 'mongoose';

type MongoToObjectFields = Pick<Document, '_id' | '__v'>;

// Todo.
export interface BaseTodo extends MongoToObjectFields {
  isPersisted: boolean;
  title: string;
  is_checked: boolean;
}

// Room.
export interface BaseRoom extends MongoToObjectFields {
  name: string;
  password: string;
  todos: BaseTodo[];
}
