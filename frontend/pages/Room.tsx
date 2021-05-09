import { useForm } from 'react-hook-form';
import { Room } from '../models';

interface RoomProps {
  room: Room;
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos } = room;
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: todos
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h1>{name}</h1>
        <ol>
          {todos.map((todo, index) => (
            <li>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                aria-invalid={errors.name ? 'true' : 'false'}
                {...register('name', { required: true })}
              />
              {errors.name && <span role="alert">This field is required</span>}

              <label htmlFor="password">Room Password</label>
              <input
                id="password"
                aria-invalid={errors.password ? 'true' : 'false'}
                {...register('password', { required: true })}
              />
              {errors.password && (
                <span role="alert">This field is required</span>
              )}

              <input type="submit" />
            </li>
          ))}
        </ol>
      </div>
    </form>
  );
}
