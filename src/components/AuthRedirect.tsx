'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Config Imports
import themeConfig from '@configs/themeConfig'

const AuthRedirect = () => {
  const pathname = usePathname()

  // Remove /en prefix if present
  const cleanPathname = pathname?.startsWith('/en') ? pathname.replace('/en', '') || '/' : pathname

  // Use pathname directly without language normalization
  const redirectUrl = `/login?redirectTo=${cleanPathname || '/'}`
  const login = `/login`
  const homePage = themeConfig.homePageUrl

  return redirect(cleanPathname === login ? login : cleanPathname === homePage ? login : redirectUrl)
}

export default AuthRedirect
