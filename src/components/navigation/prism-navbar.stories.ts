import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-navbar';

const meta: Meta = {
  title: 'Navigation & Routing/Navbar',
  component: 'prism-navbar',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-navbar></prism-navbar>
  `,
};
