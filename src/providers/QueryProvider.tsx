'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

// Default query client configuration
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 1 minute by default
        staleTime: 60 * 1000,
        // Cache data for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Retry failed requests 1 time
        retry: 1,
        // Refetch on window focus in production
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        // Don't refetch on mount if data is still fresh
        refetchOnMount: false
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new query client
    return makeQueryClient()
  } else {
    // Browser: reuse existing query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()

    return browserQueryClient
  }
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState to prevent re-creating the client every render
  // Using getQueryClient() ensures singleton pattern
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
      )}
    </QueryClientProvider>
  )
}
