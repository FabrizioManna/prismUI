import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-icon';

const meta: Meta = {
  title: 'Foundations & Actions/Icon',
  component: 'prism-icon',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-icon></prism-icon>
  `,
};
