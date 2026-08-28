import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-input';

const meta: Meta = {
  title: 'Form & Data Entry/Input',
  component: 'prism-input',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-input></prism-input>
  `,
};
