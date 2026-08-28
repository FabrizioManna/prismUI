import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-alert';

const meta: Meta = {
  title: 'Overlays & Feedback/Alert',
  component: 'prism-alert',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-alert></prism-alert>
  `,
};
