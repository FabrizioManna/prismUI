import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-pagination';

const meta: Meta = {
  title: 'Navigation & Routing/Pagination',
  component: 'prism-pagination',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-pagination></prism-pagination>
  `,
};
