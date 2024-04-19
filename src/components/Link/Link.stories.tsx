import { Meta, StoryObj } from '@storybook/react';
import Link from './index';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const InternalLink: Story = {
  args: {
    href: '#',
    children: 'This links internally',
  },
};

export const ExternalLinkLink: Story = {
  args: {
    href: '#',
    children: 'This links externally in new tab',
    isExternal: true,
  },
};
