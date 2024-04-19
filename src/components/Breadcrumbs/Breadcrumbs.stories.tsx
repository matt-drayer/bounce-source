import { Meta, StoryObj } from '@storybook/react';
import BreadcrumbsComponent from './Breadcrumbs';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof BreadcrumbsComponent> = {
  title: 'Components/Breadcrumbs',
  component: BreadcrumbsComponent,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof BreadcrumbsComponent>;

export const Breadcrumbs: Story = {
  args: {
    breadcrumbs: [
      {
        label: 'Home',
        url: '/',
      },
      {
        label: 'About',
        url: '/about',
      },
      {
        label: 'Current Page',
        url: '',
        isActivePage: true,
      },
    ],
  },
};
