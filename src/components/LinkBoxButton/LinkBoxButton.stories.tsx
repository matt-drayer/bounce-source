import { Meta, StoryObj } from '@storybook/react';
import LinkBoxButtonComponent from './LinkBoxButton';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof LinkBoxButtonComponent> = {
  title: 'Components/LinkBoxButton',
  component: LinkBoxButtonComponent,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof LinkBoxButtonComponent>;

export const LinkBoxButton: Story = {
  args: {
    href: '#',
    children: 'This is a link',
  },
};
