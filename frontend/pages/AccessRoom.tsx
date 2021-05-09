import { useForm } from 'react-hook-form';
import { Room } from '../models';
import { createRoom, CreateRoomParameters } from './query/rooms';

const FORM_DEFAULT_VALUES: CreateRoomParameters = {
  name: '',
  password: ''
};

interface Props {
  onSuccessfulAccess: (room: Room) => void;
}

export default function AccessRoom({ onSuccessfulAccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: FORM_DEFAULT_VALUES
  });

  async function onSubmit(formData: CreateRoomParameters) {
    try {
      const { data, errors } = await createRoom(formData);
      if (!data) throw new Error(errors?.join(', '));

      onSuccessfulAccess(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      {errors.password && <span role="alert">This field is required</span>}

      <input type="submit" />
    </form>
  );
}
