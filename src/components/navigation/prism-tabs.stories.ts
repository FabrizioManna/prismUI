import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-tabs';

const meta: Meta = {
  title: 'Navigation & Routing/Tabs',
  component: 'prism-tabs',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-tabs></prism-tabs>
  `,
};
