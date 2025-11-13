// Next Imports
import { redirect } from 'next/navigation'

// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { ChildrenType } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Auth Imports
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

const GuestOnlyRoute = async ({ children }: ChildrenType) => {
  // Get session with explicit authOptions
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log('[GuestOnlyRoute] No session, allowing access to login page')

    return <>{children}</>
  }

  if (!session.accessToken) {
    console.log('[GuestOnlyRoute] Session exists but no accessToken, allowing access to login page')

    return <>{children}</>
  }

  const tokenExpired = isTokenExpired(session.accessToken as string)

  if (tokenExpired) {
    console.log('[GuestOnlyRoute] AccessToken is expired, allowing access to login page')

    return <>{children}</>
  }

  // Only redirect if session exists AND has valid (non-expired) accessToken
  console.log('[GuestOnlyRoute] Valid session found, redirecting to dashboard')
  redirect(themeConfig.homePageUrl)
}

export default GuestOnlyRoute
