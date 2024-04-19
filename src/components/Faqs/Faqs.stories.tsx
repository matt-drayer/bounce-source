import { Meta, StoryObj } from '@storybook/react';
import FaqsComponent from './Faqs';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof FaqsComponent> = {
  title: 'Components/Faqs',
  component: FaqsComponent,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof FaqsComponent>;

export const Faqs: Story = {
  args: {
    questionsAnswers: [
      {
        question: 'Is this an FAQ?',
        answer: 'Yes, this is an FAQ. You can learn more by reading FAQs',
      },
      {
        question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
        answer:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, quam sapien aliquet nunc, vitae aliquam nisl nunc eget nunc. Donec euismod, nisl eget aliquam ultricies, quam sapien aliquet nunc, vitae aliquam nisl nunc eget nunc.',
      },
      {
        question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
        answer:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, quam sapien aliquet nunc, vitae aliquam nisl nunc eget nunc. Donec euismod, nisl eget aliquam ultricies, quam sapien aliquet nunc, vitae aliquam nisl nunc eget nunc.',
      },
      {
        question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
        answer:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, quam sapien aliquet nunc, vitae aliquam nisl nunc eget nunc. Donec euismod, nisl eget aliquam ultricies, quam sapien aliquet nunc, vitae aliquam nisl nunc eget nunc.',
      },
    ],
  },
};
