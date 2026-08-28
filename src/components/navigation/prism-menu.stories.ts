import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-menu';

const meta: Meta = {
  title: 'Navigation & Routing/Menu',
  component: 'prism-menu',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-menu></prism-menu>
  `,
};
