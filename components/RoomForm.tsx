import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Heading, VStack } from '@chakra-ui/layout';
import { ThemingProps, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getErrorMessage } from '../lib/utils';
import { createRoom, CreateRoomParameters } from '../lib/ui/query/rooms';

const FORM_DEFAULT_VALUES: CreateRoomParameters = {
  name: '',
  password: ''
};

interface Props {
  onSuccessfulAccess: () => void;
  request: typeof createRoom;
  title?: string;
  titleTag?: 'h1' | 'h2';
  titleSize?: ThemingProps['size'];
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
  const toast = useToast();

  async function onSubmit(formData: CreateRoomParameters) {
    try {
      setIsSubmitting(true);

      const { data, errors } = await request(formData);
      if (!data) throw new Error(errors?.join(', '));

      onSuccessfulAccess();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to access room.',
        description: getErrorMessage(err),
        status: 'error'
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
        autoComplete="off"
      >
        <Heading as={titleTag} size={titleSize} textAlign="center" mb={8}>
          {title}
        </Heading>

        <VStack spacing={2}>
          <FormControl isInvalid={errors.name !== undefined}>
            <FormLabel htmlFor="name">Room name</FormLabel>
            <Controller
              render={({ field }) => <Input {...field} type="text" />}
              name="name"
              control={control}
              rules={{
                required: 'This field is required.'
              }}
            />

            <Box height={21} mt={1}>
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </Box>
          </FormControl>

          <FormControl isInvalid={errors.password !== undefined}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Controller
              render={({ field }) => <Input {...field} type="password" />}
              name="password"
              control={control}
              rules={{
                required: 'This field is required.'
              }}
            />
            <Box height={21} mt={1}>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </Box>
          </FormControl>
        </VStack>

        <Button mt={2} isFullWidth type="submit" isDisabled={isSubmitting}>
          {isSubmitting ? loadingButtonTitle : buttonTitle}
        </Button>
      </Box>
    </Flex>
  );
}
