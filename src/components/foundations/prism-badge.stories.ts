import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-badge';

const meta: Meta = {
  title: 'Foundations & Actions/Badge',
  component: 'prism-badge',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-badge></prism-badge>
  `,
};
