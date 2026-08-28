import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-table';

const meta: Meta = {
  title: 'Data Display & Tables/Table',
  component: 'prism-table',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-table></prism-table>
  `,
};
