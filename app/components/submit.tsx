'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({ children, ...props }: React.ComponentProps<'button'>) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      {...props}
    >
      {pending ? 'Loading...' : children}
    </button>
  )
}
