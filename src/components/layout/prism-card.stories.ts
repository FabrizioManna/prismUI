import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-card';

const meta: Meta = {
  title: 'Data Display & Tables/Card',
  component: 'prism-card',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-card></prism-card>
  `,
};
