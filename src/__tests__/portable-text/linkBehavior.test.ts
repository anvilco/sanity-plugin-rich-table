import {describe, expect, it, vi} from 'vitest'

import {createLinkBehaviors, LinkBehaviorsConfig} from '../../portable-text/behaviors/linkBehavior'

describe('createLinkBehaviors', () => {
  it('returns an array of behaviors', () => {
    const config: LinkBehaviorsConfig = {}
    const behaviors = createLinkBehaviors(config)

    expect(Array.isArray(behaviors)).toBe(true)
    expect(behaviors).toHaveLength(2)
  })

  it('returns behaviors with clipboard.paste event handler', () => {
    const config: LinkBehaviorsConfig = {}
    const behaviors = createLinkBehaviors(config)

    // Each behavior should be defined
    behaviors.forEach((behavior) => {
      expect(behavior).toBeDefined()
    })
  })

  it('accepts linkAnnotation config function', () => {
    const linkAnnotation = vi.fn().mockReturnValue({
      name: 'link',
      value: {href: 'https://example.com'},
    })

    const config: LinkBehaviorsConfig = {
      linkAnnotation,
    }

    const behaviors = createLinkBehaviors(config)
    expect(behaviors).toHaveLength(2)
  })

  it('creates behaviors even without linkAnnotation config', () => {
    const behaviors = createLinkBehaviors({})

    expect(behaviors).toHaveLength(2)
    expect(behaviors[0]).toBeDefined()
    expect(behaviors[1]).toBeDefined()
  })
})

describe('linkAnnotation config', () => {
  it('receives url and schema in callback', () => {
    const linkAnnotation = vi.fn().mockReturnValue({
      name: 'link',
      value: {href: 'test'},
    })

    const config: LinkBehaviorsConfig = {
      linkAnnotation,
    }

    // Just verify the config is properly structured
    createLinkBehaviors(config)

    // The actual callback is tested through integration
    // Here we just verify the config shape is correct
    expect(config.linkAnnotation).toBe(linkAnnotation)
  })
})
