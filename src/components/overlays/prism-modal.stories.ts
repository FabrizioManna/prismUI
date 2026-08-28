import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-modal';

const meta: Meta = {
  title: 'Overlays & Feedback/Modal',
  component: 'prism-modal',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-modal></prism-modal>
  `,
};
