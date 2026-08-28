import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-breadcrumb';

const meta: Meta = {
  title: 'Navigation & Routing/Breadcrumb',
  component: 'prism-breadcrumb',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-breadcrumb></prism-breadcrumb>
  `,
};
