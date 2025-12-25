// Third-party Imports

import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'


// Type Imports
import type { ChildrenType } from '@core/types'

// Imports for auth options
import { authOptions } from '@/libs/auth'

// Helper function to decode JWT and check if expired
function isTokenExpired(token: string): boolean {
  try {
    // JWT format: header.payload.signature
    
    const parts = token.split('.')
    
    if (parts.length !== 3) return true

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    const currentTime = Date.now()

    return currentTime > expirationTime

  } catch (error) {
    console.error('Error checking token expiration:', error)

    return true // Assume expired if can't decode
  }
}

export default async function AuthGuard({ children }: ChildrenType) {
  // Get session with explicit authOptions
  const session = await getServerSession(authOptions)

  if (!session) {
    // Direct server-side redirect - works immediately without component

    redirect('/login')
  }

  // Validate that accessToken exists and is not expired
  const tokenExpired = isTokenExpired(session.accessToken as string)

  if (!session.accessToken) {

    redirect('/login')
  }

  if (tokenExpired) {

    redirect('/login')
  }



  return <>{children}</>
}
