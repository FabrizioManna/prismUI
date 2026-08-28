import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './prism-button'; // Import the component to register it

// Storybook metadata (this hooks into custom-elements.json automatically)
const meta: Meta = {
  title: 'Foundations & Actions/Button',
  component: 'prism-button', // The tag name exactly as it appears in custom-elements.json
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};
export default meta;

type Story = StoryObj;

// Default Story
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  },
  render: (args) => html`
    <prism-button 
      variant="${args.variant}" 
      size="${args.size}" 
      ?disabled="${args.disabled}" 
      ?loading="${args.loading}">
      Click Me
    </prism-button>
  `,
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: 'secondary',
  },
  render: Primary.render,
};

export const Danger: Story = {
  args: {
    ...Primary.args,
    variant: 'danger',
  },
  render: Primary.render,
};
