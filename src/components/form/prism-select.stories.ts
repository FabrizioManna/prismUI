import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-select';

const meta: Meta = {
  title: 'Form & Data Entry/Select',
  component: 'prism-select',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-select></prism-select>
  `,
};
