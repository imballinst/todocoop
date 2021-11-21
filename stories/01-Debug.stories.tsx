import React from 'react';
import { rest } from 'msw';
import { ChakraProvider } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import '@fontsource/montserrat/700.css';

import { appTheme } from '../theme';
import RoomPage from '../pages/room';
import { BaseRoom } from '../types/models';
import { ClientStateProvider } from '../components/contexts/ClientStateContext';
import { mswWorker } from '../mocks/msw-browser';

function Wrapper() {
  return <RoomPage />;
}

export default {
  title: 'Example/Debug',
  component: Wrapper,
  argTypes: {},
  decorators: [
    (Story) => {
      mswWorker.use(
        rest.get('/api/current-room', (_req, res, ctx) => {
          return res(
            ctx.json({
              name: 'test-room',
              password: 'test-password',
              todos: Array.from(new Array(25), (_, idx) => ({
                _id: `${idx + 1}`,
                title: `test todo ${idx + 1}`,
                isChecked: true,
                isPersisted: true,
                localId: `${idx + 1}`
              }))
            } as BaseRoom)
          );
        })
      );

      return <Story />;
    }
  ]
} as ComponentMeta<typeof Wrapper>;

const queryClient = new QueryClient();

const Template: ComponentStory<typeof Wrapper> = (args) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={appTheme}>
      <ClientStateProvider>
        <Wrapper {...args} />
      </ClientStateProvider>
    </ChakraProvider>
  </QueryClientProvider>
);

export const Primary = Template.bind({});
Primary.args = {};
