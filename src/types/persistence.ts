export interface CookieOptions {
  maxAge?: number
  path?: string
  sameSite?: 'lax' | 'strict' | 'none'
}

export interface PersistenceConfig {
  enabled?: boolean
  key?: string
  storage?: 'cookie' | 'localStorage' | 'sessionStorage'
  cookieOptions?: CookieOptions
}

export interface ResolvedPersistenceConfig {
  enabled: boolean
  key: string
  storage: 'cookie' | 'localStorage' | 'sessionStorage'
  cookieOptions: Required<CookieOptions>
}
