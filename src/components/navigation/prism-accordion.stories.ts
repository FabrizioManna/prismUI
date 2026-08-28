import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-accordion';

const meta: Meta = {
  title: 'Navigation & Routing/Accordion',
  component: 'prism-accordion',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-accordion></prism-accordion>
  `,
};
