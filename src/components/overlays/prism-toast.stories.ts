import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-toast';

const meta: Meta = {
  title: 'Overlays & Feedback/Toast',
  component: 'prism-toast',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-toast></prism-toast>
  `,
};
