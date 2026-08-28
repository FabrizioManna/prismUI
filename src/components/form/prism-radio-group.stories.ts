import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-radio-group';

const meta: Meta = {
  title: 'Form & Data Entry/Radio Group',
  component: 'prism-radio-group',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-radio-group></prism-radio-group>
  `,
};
