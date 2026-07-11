import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  loading?: boolean
}

// Figma spec: sm=32px, md=44px, lg=52px total height
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-400 py-200 gap-100 text-sm leading-4 rounded-200',
  md: 'px-600 py-300 gap-100 text-base leading-5 rounded-200',
  lg: 'px-800 py-400 gap-100 text-base leading-5 rounded-200',
}

const iconSize: Record<ButtonSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'lg',
      leadingIcon,
      trailingIcon,
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        // Loading uses aria-disabled so the button stays focusable and keeps
        // accent colors (contrast 7.83:1). True disabled gets native disabled
        // semantics and the dim treatment (WCAG exempts disabled controls).
        disabled={disabled && !loading}
        aria-disabled={loading || disabled || undefined}
        aria-busy={loading || undefined}
        className={[
          'inline-flex items-center justify-center font-semibold transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-accent',
          // Default + loading: keep accent so contrast stays 7.83:1
          'bg-bg-accent text-text-inverse',
          // Hover (suppressed while loading via pointer-events)
          'hover:bg-bg-accent-hover',
          // Loading: block interaction but keep accent appearance
          loading ? 'cursor-wait pointer-events-none' : '',
          // Disabled (not loading): dim treatment — WCAG exempts disabled controls
          !loading && disabled ? 'disabled:bg-bg-tertiary disabled:text-text-tertiary disabled:cursor-not-allowed' : '',
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading ? (
          <svg
            className={`animate-spin ${iconSize[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          leadingIcon && <span className={`${iconSize[size]} shrink-0`} aria-hidden="true">{leadingIcon}</span>
        )}
        {children}
        {trailingIcon && !loading && (
          <span className={`${iconSize[size]} shrink-0`} aria-hidden="true">{trailingIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
