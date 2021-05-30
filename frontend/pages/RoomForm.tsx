import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Heading, VStack } from '@chakra-ui/layout';
import { Controller, useForm } from 'react-hook-form';
import { createRoom, CreateRoomParameters } from './query/rooms';

const FORM_DEFAULT_VALUES: CreateRoomParameters = {
  name: '',
  password: ''
};

interface Props {
  onSuccessfulAccess: () => void;
  request: typeof createRoom;
  title: string;
}

export function RoomForm({ onSuccessfulAccess, request, title }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: FORM_DEFAULT_VALUES
  });

  async function onSubmit(formData: CreateRoomParameters) {
    try {
      const { data, errors } = await request(formData);
      if (!data) throw new Error(errors?.join(', '));

      onSuccessfulAccess();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      <Box
        width={320}
        height={344}
        p={4}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        autoComplete="off"
      >
        <Heading as="h1" size="lg">
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

        <Button mt={2} isFullWidth type="submit" colorScheme="blue">
          {title}
        </Button>
      </Box>
    </Flex>
  );
}
