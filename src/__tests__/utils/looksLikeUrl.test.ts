import {describe, expect, it} from 'vitest'

import {looksLikeUrl} from '../../portable-text/behaviors/looks-like-url'

describe('looksLikeUrl valid URLs', () => {
  it('returns true for http URLs', () => {
    expect(looksLikeUrl('http://example.com')).toBe(true)
  })

  it('returns true for https URLs', () => {
    expect(looksLikeUrl('https://example.com')).toBe(true)
  })

  it('returns true for https URLs with paths', () => {
    expect(looksLikeUrl('https://example.com/path/to/page')).toBe(true)
  })

  it('returns true for https URLs with query params', () => {
    expect(looksLikeUrl('https://example.com?foo=bar&baz=qux')).toBe(true)
  })

  it('returns true for mailto URLs', () => {
    expect(looksLikeUrl('mailto:test@example.com')).toBe(true)
  })

  it('returns true for tel URLs', () => {
    expect(looksLikeUrl('tel:+1234567890')).toBe(true)
  })
})

describe('looksLikeUrl invalid URLs', () => {
  it('returns false for plain text', () => {
    expect(looksLikeUrl('hello world')).toBe(false)
  })

  it('returns false for URLs without protocol', () => {
    expect(looksLikeUrl('example.com')).toBe(false)
  })

  it('returns false for ftp URLs', () => {
    expect(looksLikeUrl('ftp://example.com')).toBe(false)
  })

  it('returns false for file URLs', () => {
    expect(looksLikeUrl('file:///path/to/file')).toBe(false)
  })

  it('returns false for disallowed protocols', () => {
    // Testing that non-http/https/mailto/tel protocols are rejected
    expect(looksLikeUrl('data:text/html,<h1>test</h1>')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(looksLikeUrl('')).toBe(false)
  })

  it('returns false for malformed URLs', () => {
    expect(looksLikeUrl('http://')).toBe(false)
  })
})
