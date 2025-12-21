// src/runtime/utils/persistence.ts
import type { PersistenceConfig } from '../types'

export interface ResolvedPersistenceConfig {
  enabled: boolean
  key: string
  storage: 'cookie' | 'localStorage' | 'sessionStorage'
  cookieOptions: {
    maxAge: number
    path: string
    sameSite: 'strict' | 'lax' | 'none'
  }
}

export function resolvePersistenceConfig(
  options?: PersistenceConfig,
): ResolvedPersistenceConfig {
  return {
    enabled: options?.enabled ?? true,
    key: options?.key ?? 'nuxt-vuetify-theme',
    storage: options?.storage ?? 'cookie',
    cookieOptions: {
      maxAge: options?.cookieOptions?.maxAge ?? 60 * 60 * 24 * 365,
      path: options?.cookieOptions?.path ?? '/',
      sameSite: options?.cookieOptions?.sameSite ?? 'lax',
    },
  }
}

export function getPersistedTheme(config: ResolvedPersistenceConfig): string | null {
  if (!config.enabled || !import.meta.client) return null

  try {
    switch (config.storage) {
      case 'localStorage':
        return localStorage.getItem(config.key)
      case 'sessionStorage':
        return sessionStorage.getItem(config.key)
      case 'cookie':
      default:
        return getCookie(config.key)
    }
  }
  catch {
    return null
  }
}

export function setPersistedTheme(config: ResolvedPersistenceConfig, theme: string): void {
  if (!config.enabled || !import.meta.client) return

  try {
    switch (config.storage) {
      case 'localStorage':
        localStorage.setItem(config.key, theme)
        break
      case 'sessionStorage':
        sessionStorage.setItem(config.key, theme)
        break
      case 'cookie':
      default:
        setCookie(config.key, theme, config.cookieOptions)
    }
  }
  catch {
    // Silently fail
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match && match[2] ? decodeURIComponent(match[2]) : null
}

function setCookie(
  name: string,
  value: string,
  options: ResolvedPersistenceConfig['cookieOptions'],
): void {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `max-age=${options.maxAge}`,
    `path=${options.path}`,
    `SameSite=${options.sameSite}`,
  ]

  if (options.sameSite === 'none') {
    parts.push('Secure')
  }

  document.cookie = parts.join('; ')
}
