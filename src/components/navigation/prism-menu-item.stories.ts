import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-menu-item';

const meta: Meta = {
  title: 'Navigation & Routing/Menu Item',
  component: 'prism-menu-item',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-menu-item></prism-menu-item>
  `,
};
