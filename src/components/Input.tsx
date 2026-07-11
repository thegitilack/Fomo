import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label?: string
  helpText?: string
  errorMessage?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helpText, errorMessage, icon, disabled, className, ...props }, ref) => {
    const generatedId = useId()
    const id = props['aria-label'] ? undefined : generatedId
    const hasError = Boolean(errorMessage)

    const containerClasses = [
      'flex items-center gap-200 p-300 w-full transition-colors duration-150',
      'rounded-300',
      hasError
        ? 'bg-bg-error border-2 border-border-error'
        : disabled
        ? 'bg-bg-tertiary border border-border-subtle'
        : 'bg-bg-primary border border-border-default focus-within:border-2 focus-within:border-border-accent',
    ].join(' ')

    return (
      <div className={['flex flex-col gap-200 w-full', className].filter(Boolean).join(' ')}>
        {label && (
          <label
            htmlFor={id}
            className="text-base leading-5 font-normal text-text-primary"
          >
            {label}
          </label>
        )}

        <div className={containerClasses}>
          {icon && (
            <span
              className={['size-5 shrink-0', disabled ? 'text-text-tertiary' : hasError ? 'text-border-error' : 'text-text-secondary'].join(' ')}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={
              hasError ? `${id}-error` : helpText ? `${id}-help` : undefined
            }
            className={[
              'flex-1 min-w-0 bg-transparent outline-none',
              'text-base leading-5 font-normal',
              'placeholder:text-text-secondary',
              disabled
                ? 'text-text-tertiary placeholder:text-text-tertiary cursor-not-allowed'
                : 'text-text-primary',
            ].join(' ')}
            {...props}
          />
        </div>

        {hasError ? (
          <div id={`${id}-error`} className="flex items-center gap-100" role="alert">
            <svg className="size-4 shrink-0 text-text-error" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13A6.5 6.5 0 0 0 8 1.5ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5Zm0 6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
            <p className="text-sm leading-4 font-normal text-text-error">{errorMessage}</p>
          </div>
        ) : helpText ? (
          <p id={`${id}-help`} className="text-sm leading-4 font-normal text-text-secondary">
            {helpText}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
