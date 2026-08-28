import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-drawer';

const meta: Meta = {
  title: 'Overlays & Feedback/Drawer',
  component: 'prism-drawer',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-drawer></prism-drawer>
  `,
};
