import { useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'

const UserIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a5.75 5.75 0 1 1-11.5 0 5.75 5.75 0 0 1 11.5 0ZM4.501 17.5a8.25 8.25 0 0 1 11 0" />
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5h-13A1.5 1.5 0 0 0 2 5v10a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 18 15V5a1.5 1.5 0 0 0-1.5-1.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m2 5 8 6.5L18 5" />
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 8V6a4 4 0 1 0-8 0v2" />
    <rect x="3" y="8" width="14" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="13" r="1.25" fill="currentColor" stroke="none" />
  </svg>
)

export interface RegistrationPageErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export interface RegistrationPageProps {
  errors?: RegistrationPageErrors
  onSubmit?: (data: { name: string; email: string; password: string }) => void
}

export function RegistrationPage({ errors: externalErrors, onSubmit }: RegistrationPageProps) {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const errors = externalErrors ?? {}

  function set(field: keyof typeof values) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues(v => ({ ...v, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onSubmit?.({ name: values.name, email: values.email, password: values.password })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-600">
      <div className="w-full max-w-[440px] flex flex-col gap-600">

        {/* Header */}
        <div className="flex flex-col gap-200 text-center">
          <h1 className="text-2xl leading-8 font-semibold text-text-primary">
            Create an account
          </h1>
          <p className="text-base leading-5 font-normal text-text-secondary">
            Start your free trial today. No credit card required.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-bg-primary rounded-400 border border-border-subtle p-800 flex flex-col gap-600"
        >
          <div className="flex flex-col gap-400">
            <Input
              label="Full name"
              placeholder="Jane Smith"
              autoComplete="name"
              icon={<UserIcon />}
              errorMessage={errors.name}
              value={values.name}
              onChange={set('name')}
            />
            <Input
              label="Email address"
              placeholder="jane@example.com"
              type="email"
              autoComplete="email"
              icon={<EmailIcon />}
              errorMessage={errors.email}
              value={values.email}
              onChange={set('email')}
            />
            <Input
              label="Password"
              placeholder="Min. 8 characters"
              type="password"
              autoComplete="new-password"
              icon={<LockIcon />}
              helpText="Use 8+ characters with a mix of letters and numbers."
              errorMessage={errors.password}
              value={values.password}
              onChange={set('password')}
            />
            <Input
              label="Confirm password"
              placeholder="Repeat your password"
              type="password"
              autoComplete="new-password"
              icon={<LockIcon />}
              errorMessage={errors.confirmPassword}
              value={values.confirmPassword}
              onChange={set('confirmPassword')}
            />
          </div>

          <Button type="submit" size="lg" loading={loading} className="w-full">
            Create account
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm leading-4 text-text-secondary">
          Already have an account?{' '}
          <a href="#" className="font-semibold text-text-primary underline underline-offset-2 hover:text-bg-accent">
            Sign in
          </a>
        </p>

      </div>
    </div>
  )
}
