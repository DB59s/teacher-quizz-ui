import { getSession, signOut } from 'next-auth/react'

async function callRefreshToken(refreshToken: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  })

  if (!response.ok) throw new Error('Failed to refresh token')

  return await response.json()
}

export async function fetchApi(input: RequestInfo, init?: RequestInit) {
  const session = await getSession()
  let token = session?.accessToken
  let refreshToken = session?.refreshToken

  let response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json'
    }
  })

  if (response.status === 401 && refreshToken) {
    try {
      const refreshed = await callRefreshToken(refreshToken)

      token = refreshed.accessToken
      refreshToken = refreshed.refreshToken
      response = await fetch(input, {
        ...init,
        headers: {
          ...(init?.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'application/json'
        }
      })
    } catch (err) {
      await signOut({ redirect: false })

      return response
    }
  }

  return response
}
