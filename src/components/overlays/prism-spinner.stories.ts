import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-spinner';

const meta: Meta = {
  title: 'Overlays & Feedback/Spinner',
  component: 'prism-spinner',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-spinner></prism-spinner>
  `,
};
