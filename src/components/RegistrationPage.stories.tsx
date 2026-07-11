import type { Meta, StoryObj } from '@storybook/react'
import { RegistrationPage } from './RegistrationPage'

const meta: Meta<typeof RegistrationPage> = {
  title: 'Pages/Registration',
  component: RegistrationPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof RegistrationPage>

export const Default: Story = {}

export const WithErrors: Story = {
  args: {
    errors: {
      name: 'Name is required',
      email: 'Enter a valid email address',
      password: 'Password must be at least 8 characters',
      confirmPassword: 'Passwords do not match',
    },
  },
}
