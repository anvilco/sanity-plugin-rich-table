const sensibleProtocols = ['http:', 'https:', 'mailto:', 'tel:']

export function looksLikeUrl(text: string): boolean {
  let isUrl = false
  try {
    const url = new URL(text)

    if (!sensibleProtocols.includes(url.protocol)) {
      return false
    }

    isUrl = true
  } catch {
    // Invalid URL, return false
  }
  return isUrl
}
