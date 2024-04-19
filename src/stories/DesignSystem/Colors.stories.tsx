import { Meta, StoryObj } from '@storybook/react';
import Colors from './Colors';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Colors> = {
  title: 'DesignSystem/Colors',
  component: Colors,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Colors>;

export const DesignSystemColors: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
