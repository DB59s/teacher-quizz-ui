'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Config Imports
import themeConfig from '@configs/themeConfig'

const AuthRedirect = () => {
  const pathname = usePathname()

  // Normalize pathname: strip leading language segments like /en or /fr if present
  const normalizedPath = (() => {
    if (!pathname) return pathname

    const parts = pathname.split('/')

    if (parts[1] && /^[a-z]{2}$/i.test(parts[1])) {
      const rest = parts.slice(2).join('/')

      return rest ? `/${rest}` : '/'
    }

    return pathname
  })()

  // ℹ️ Bring me `lang`
  const redirectUrl = `/login?redirectTo=${normalizedPath}`
  const login = `/login`
  const homePage = themeConfig.homePageUrl

  return redirect(normalizedPath === login ? login : normalizedPath === homePage ? login : redirectUrl)
}

export default AuthRedirect
