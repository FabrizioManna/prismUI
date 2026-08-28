import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-sidebar';

const meta: Meta = {
  title: 'Navigation & Routing/Sidebar',
  component: 'prism-sidebar',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-sidebar></prism-sidebar>
  `,
};
