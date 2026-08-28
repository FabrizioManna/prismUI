import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-avatar';

const meta: Meta = {
  title: 'Foundations & Actions/Avatar',
  component: 'prism-avatar',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-avatar></prism-avatar>
  `,
};
