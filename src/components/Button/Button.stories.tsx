import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Button',
  },
};

export const Inline: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Button',
    isInline: true,
  },
};
