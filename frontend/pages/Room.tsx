import { Room } from '../models';

export function Room({ name, todos }: Room) {
  return (
    <div>
      <h1>{name}</h1>
      <ol>
        {todos.map((todo) => (
          <li>
            {todo.title} - {todo.is_checked}
          </li>
        ))}
      </ol>
    </div>
  );
}
