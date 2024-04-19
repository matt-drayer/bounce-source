import { Meta, StoryObj } from '@storybook/react';
import Typography from './Typography';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Typography> = {
  title: 'DesignSystem/Typography',
  component: Typography,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const DesignSystemTypography: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
