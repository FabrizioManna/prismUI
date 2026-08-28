import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-tooltip';

const meta: Meta = {
  title: 'Data Display & Tables/Tooltip',
  component: 'prism-tooltip',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-tooltip></prism-tooltip>
  `,
};
