import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-stat';

const meta: Meta = {
  title: 'Data Display & Tables/Stat',
  component: 'prism-stat',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-stat></prism-stat>
  `,
};
