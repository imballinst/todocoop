export interface BaseTodo {
  // Mongo fields.
  _id?: string;
  __v?: number;
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
export interface BaseRoom {
  _id?: string;
  __v?: number;
  name: string;
  password: string;
  todos: BaseTodo[];
}

export interface UiRoom {
  _id?: string;
  __v?: number;
  name: string;
  password: string;
  todos: UiTodo[];
}
