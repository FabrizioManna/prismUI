import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-progress';

const meta: Meta = {
  title: 'Data Display & Tables/Progress',
  component: 'prism-progress',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-progress></prism-progress>
  `,
};
