import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Field
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getErrorMessage } from '../lib/utils';
import { createRoom, type CreateRoomParameters } from '../lib/ui/query/rooms';
import { toaster } from './Toaster';

const FORM_DEFAULT_VALUES: CreateRoomParameters = {
  name: '',
  password: ''
};

interface Props {
  onSuccessfulAccess: () => void;
  request: typeof createRoom;
  title?: string;
  titleTag?: 'h1' | 'h2';
  titleSize?: 'sm' | 'md' | 'lg' | 'xl';
  buttonTitle?: string;
  loadingButtonTitle: string;
}

export function RoomForm({
  onSuccessfulAccess,
  request,
  title,
  titleTag = 'h1',
  titleSize = 'lg',
  buttonTitle = title,
  loadingButtonTitle
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: FORM_DEFAULT_VALUES
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(formData: CreateRoomParameters) {
    try {
      setIsSubmitting(true);

      const { data: responseData } = await request(formData);
      const { data, errors } = responseData;
      if (!data) throw new Error(errors?.map((el) => el.message).join(', '));

      onSuccessfulAccess();
    } catch (err) {
      console.error(err);
      toaster.create({
        title: 'Failed to access room.',
        description: getErrorMessage(err),
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box
        width={['100%', 320]}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
      >
        <Heading as={titleTag} size={titleSize} textAlign="center" mb={8}>
          {title}
        </Heading>

        <Stack gap={2}>
          <Field.Root invalid={errors.name !== undefined}>
            <Field.Label htmlFor="name">Room name</Field.Label>
            <Controller
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  type="text"
                  autoComplete="off"
                />
              )}
              name="name"
              control={control}
              rules={{
                required: 'This field is required.'
              }}
            />

            <Box height={21} mt={1}>
              <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
            </Box>
          </Field.Root>

          <Field.Root invalid={errors.password !== undefined}>
            <Field.Label htmlFor="password">Password</Field.Label>
            <Controller
              render={({ field }) => (
                <Input
                  {...field}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                />
              )}
              name="password"
              control={control}
              rules={{
                required: 'This field is required.'
              }}
            />
            <Box height={21} mt={1}>
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Box>
          </Field.Root>
        </Stack>

        <Button
          mt={2}
          width="full"
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? loadingButtonTitle : buttonTitle}
        </Button>
      </Box>
    </Flex>
  );
}
