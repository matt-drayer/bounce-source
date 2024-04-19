import { Meta, StoryObj } from '@storybook/react';
import CopyrightComponent from './Copyright';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof CopyrightComponent> = {
  title: 'Components/Copyright',
  component: CopyrightComponent,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CopyrightComponent>;

export const Copyright: Story = {
  args: {},
};
