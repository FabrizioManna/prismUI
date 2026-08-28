import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-file-upload';

const meta: Meta = {
  title: 'Form & Data Entry/File Upload',
  component: 'prism-file-upload',
  argTypes: {},
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <prism-file-upload></prism-file-upload>
  `,
};
