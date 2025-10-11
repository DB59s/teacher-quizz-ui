// types/next-auth.d.ts
import type { DefaultSession, DefaultUser } from 'next-auth'
import type { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    user: {
      id: string
      email: string
      role: string
      user_id: string
      full_name: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    email: string
    role: string
    user_id: string
    full_name: string
    accessToken: string
    refreshToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    email: string
    role: string
    user_id: string
    full_name: string
    accessToken: string
    refreshToken: string
  }
}
