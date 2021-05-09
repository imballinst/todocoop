import { Room } from '../models';

interface RoomProps {
  room: Room;
}

export function Room({ room }: RoomProps) {
  const { name, todos } = room;

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
