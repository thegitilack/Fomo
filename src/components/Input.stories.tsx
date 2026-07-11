import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'
import type { InputProps } from './Input'

// Placeholder icon matching Figma's 20px icon slot
const PlaceholderIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-full" aria-hidden="true">
    <rect x="3" y="3" width="14" height="14" rx="2" strokeDasharray="3 2" />
    <path strokeLinecap="round" d="M7 10h6M10 7v6" />
  </svg>
)

// Extra story-level args for boolean toggles (not part of InputProps)
type StoryArgs = InputProps & {
  showIcon: boolean
  showHelpText: boolean
  showLabel: boolean
}

const meta: Meta<StoryArgs> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    errorMessage: { control: 'text' },
    disabled: { control: 'boolean' },
    showIcon: {
      control: 'boolean',
      description: 'Show icon at the leading edge of the input',
      table: { category: 'Toggles' },
    },
    showHelpText: {
      control: 'boolean',
      description: 'Show help text below the input',
      table: { category: 'Toggles' },
    },
    showLabel: {
      control: 'boolean',
      description: 'Show label above the input',
      table: { category: 'Toggles' },
    },
    // Raw props — controlled via boolean toggles above
    icon: { table: { disable: true } },
    helpText: { table: { disable: true } },
    label: { table: { disable: true } },
  },
  args: {
    placeholder: 'Placeholder text',
    showIcon: true,
    showHelpText: true,
    showLabel: true,
    disabled: false,
  },
  render: ({ showIcon, showHelpText, showLabel, ...args }) => (
    <Input
      {...args}
      label={showLabel ? 'Input label' : undefined}
      icon={showIcon ? <PlaceholderIcon /> : undefined}
      helpText={showHelpText ? 'Help text' : undefined}
    />
  ),
  decorators: [
    (Story) => (
      <div className="p-400 max-w-sm">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<StoryArgs>

// ── Figma states ─────────────────────────────────────────────────────────────

export const Default: Story = {}

export const Active: Story = {
  args: { defaultValue: 'Text entered by the user', autoFocus: true },
}

export const Error: Story = {
  args: {
    errorMessage: 'Error text',
    showHelpText: false,
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

// ── Toggles ───────────────────────────────────────────────────────────────────

export const NoIcon: Story = {
  name: 'No Icon',
  args: { showIcon: false },
}

export const NoHelpText: Story = {
  name: 'No Help Text',
  args: { showHelpText: false },
}

export const MinimalInput: Story = {
  name: 'Minimal (no icon, no help text)',
  args: { showIcon: false, showHelpText: false },
}

// ── Matrix — all Figma states ─────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants — Figma',
  render: () => (
    <div className="flex flex-col gap-600 p-400 max-w-sm">
      <Input
        label="Input label"
        placeholder="Placeholder text"
        helpText="Help text"
        icon={<PlaceholderIcon />}
      />
      <Input
        label="Input label"
        defaultValue="Text entered by the user"
        helpText="Help text"
        icon={<PlaceholderIcon />}
        autoFocus
      />
      <Input
        label="Input label"
        placeholder="Placeholder text"
        errorMessage="Error text"
        icon={<PlaceholderIcon />}
      />
      <Input
        label="Input label"
        placeholder="Placeholder text"
        helpText="Help text"
        icon={<PlaceholderIcon />}
        disabled
      />
    </div>
  ),
}
