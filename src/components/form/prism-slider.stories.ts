import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-slider';

const meta: Meta = {
  title: 'Form & Data Entry/Slider',
  component: 'prism-slider',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-slider></prism-slider>
  `,
};
