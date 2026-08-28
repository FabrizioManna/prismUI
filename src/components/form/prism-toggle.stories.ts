import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-toggle';

const meta: Meta = {
  title: 'Form & Data Entry/Toggle',
  component: 'prism-toggle',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-toggle></prism-toggle>
  `,
};
