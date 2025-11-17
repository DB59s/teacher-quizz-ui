'use client'

// Third-party Imports
import { SessionProvider } from 'next-auth/react'
import type { SessionProviderProps } from 'next-auth/react'

export const NextAuthProvider = ({ children, ...rest }: SessionProviderProps) => {
  return (
    <SessionProvider
      {...rest}
      refetchInterval={0} // Disable automatic session polling
      refetchOnWindowFocus={false} // Disable refetch on window focus
    >
      {children}
    </SessionProvider>
  )
}
