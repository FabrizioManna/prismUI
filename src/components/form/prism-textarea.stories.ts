import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-textarea';

const meta: Meta = {
  title: 'Form & Data Entry/Textarea',
  component: 'prism-textarea',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-textarea></prism-textarea>
  `,
};
