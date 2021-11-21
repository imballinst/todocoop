import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'Storybook Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Button>;

// Stories containing all buttons.
const AllButtonsTemplate: ComponentStory<typeof Button> = () => (
  <>
    {[
      <Button label="Button with primary=true" primary />,
      <Button label="Button with size=large" size="large" />,
      <Button label="Button with size=small" size="small" />,
      <Button
        label="Button with primary=true and size=large"
        primary
        size="large"
      />
    ].map((el) => (
      <div style={{ marginBottom: 8 }}>{el}</div>
    ))}
  </>
);

export const AllButtons = AllButtonsTemplate.bind({});

// Stories containing one button each.
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button'
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button'
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button'
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button'
};
