import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-radio';

const meta: Meta = {
  title: 'Form & Data Entry/Radio',
  component: 'prism-radio',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: () => html`
    <prism-radio></prism-radio>
  `,
};
