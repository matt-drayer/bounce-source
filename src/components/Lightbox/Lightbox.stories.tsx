import { Meta, StoryObj } from '@storybook/react';
import LightboxComponent from './Lightbox';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof LightboxComponent> = {
  title: 'Components/Lightbox',
  component: LightboxComponent,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof LightboxComponent>;

export const Lightbox: Story = {
  args: {
    items: [
      <img src="https://placehold.it/300x300" alt="Placeholder" />,
      <img src="https://placehold.it/300x300" alt="Placeholder" />,
      <img src="https://placehold.it/300x300" alt="Placeholder" />,
    ],
    isOpen: true,
    onClose: () => {},
  },
};
