// src/runtime/utils/preload.ts
export interface PreloadConfig {
  fonts?: boolean
  criticalCSS?: boolean
}

export function generatePreloadLinks(config: PreloadConfig = {}): string[] {
  const links: string[] = []

  if (config.fonts) {
    // Preload MDI font (most common)
    links.push(
      '<link rel="preload" href="/_nuxt/materialdesignicons-webfont.woff2" as="font" type="font/woff2" crossorigin>',
    )
  }

  return links
}

export function injectPreloadHints(head: any, config: PreloadConfig): void {
  const links = generatePreloadLinks(config)

  for (const link of links) {
    head.push(link)
  }
}
