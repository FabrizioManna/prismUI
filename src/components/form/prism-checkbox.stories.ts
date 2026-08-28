import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-checkbox';

const meta: Meta = {
  title: 'Form & Data Entry/Checkbox',
  component: 'prism-checkbox',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-checkbox></prism-checkbox>
  `,
};
