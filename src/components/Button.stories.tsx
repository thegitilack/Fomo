import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import type { ButtonProps, ButtonSize } from './Button'

// Placeholder icon matching Figma's icon slot size
const PlaceholderIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-full" aria-hidden="true">
    <rect x="3" y="3" width="14" height="14" rx="2" strokeDasharray="3 2" />
    <path strokeLinecap="round" d="M7 10h6M10 7v6" />
  </svg>
)

// Extra story-level args for boolean icon toggles (not part of ButtonProps)
type StoryArgs = ButtonProps & {
  showLeadingIcon: boolean
  showTrailingIcon: boolean
}

const meta: Meta<StoryArgs> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] satisfies ButtonSize[],
      description: 'sm = 32px · md = 44px · lg = 52px (total height)',
    },
    showLeadingIcon: {
      control: 'boolean',
      description: 'Show icon before label',
      table: { category: 'Icons' },
    },
    showTrailingIcon: {
      control: 'boolean',
      description: 'Show icon after label',
      table: { category: 'Icons' },
    },
    // Hide the raw ReactNode props — controlled via the booleans above
    leadingIcon: { table: { disable: true } },
    trailingIcon: { table: { disable: true } },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Button',
    size: 'lg',
    showLeadingIcon: true,
    showTrailingIcon: true,
    loading: false,
    disabled: false,
  },
  // Meta-level render maps boolean toggles → ReactNode props
  render: ({ showLeadingIcon, showTrailingIcon, ...args }) => (
    <Button
      {...args}
      leadingIcon={showLeadingIcon ? <PlaceholderIcon /> : undefined}
      trailingIcon={showTrailingIcon ? <PlaceholderIcon /> : undefined}
    />
  ),
}

export default meta
type Story = StoryObj<StoryArgs>

// ── Individual size stories ──────────────────────────────────────────────────

export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }

// ── State stories ────────────────────────────────────────────────────────────

export const Disabled: Story = { args: { disabled: true } }
export const Loading: Story = {
  args: { loading: true, showLeadingIcon: false, showTrailingIcon: false },
}

// ── Icon composition ─────────────────────────────────────────────────────────

export const LabelOnly: Story = {
  name: 'Label Only',
  args: { showLeadingIcon: false, showTrailingIcon: false },
}
export const LeadingIcon: Story = {
  name: 'Leading Icon',
  args: { showLeadingIcon: true, showTrailingIcon: false },
}
export const TrailingIcon: Story = {
  name: 'Trailing Icon',
  args: { showLeadingIcon: false, showTrailingIcon: true },
}
export const BothIcons: Story = {
  name: 'Both Icons',
  args: { showLeadingIcon: true, showTrailingIcon: true },
}

// ── Matrix stories ───────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants — Figma',
  render: () => (
    <div className="flex flex-col gap-300 p-400">
      {(['lg', 'md', 'sm'] satisfies ButtonSize[]).map((size) => (
        <div key={size} className="flex items-center gap-300 flex-wrap">
          <Button size={size} leadingIcon={<PlaceholderIcon />} trailingIcon={<PlaceholderIcon />}>Button</Button>
          <Button size={size} leadingIcon={<PlaceholderIcon />} trailingIcon={<PlaceholderIcon />} disabled>Button</Button>
        </div>
      ))}
    </div>
  ),
}

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className="flex items-end gap-300 flex-wrap p-400">
      <Button size="sm" leadingIcon={<PlaceholderIcon />} trailingIcon={<PlaceholderIcon />}>Small</Button>
      <Button size="md" leadingIcon={<PlaceholderIcon />} trailingIcon={<PlaceholderIcon />}>Medium</Button>
      <Button size="lg" leadingIcon={<PlaceholderIcon />} trailingIcon={<PlaceholderIcon />}>Large</Button>
    </div>
  ),
}

export const IconCompositions: Story = {
  name: 'Icon Compositions',
  render: () => (
    <div className="flex items-center gap-300 flex-wrap p-400">
      <Button size="md">Label only</Button>
      <Button size="md" leadingIcon={<PlaceholderIcon />}>Leading</Button>
      <Button size="md" trailingIcon={<PlaceholderIcon />}>Trailing</Button>
      <Button size="md" leadingIcon={<PlaceholderIcon />} trailingIcon={<PlaceholderIcon />}>Both</Button>
    </div>
  ),
}
