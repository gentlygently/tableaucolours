
import { describe, expect, it, beforeEach } from 'vitest'
import { usePaletteStore } from './src/stores/palette'
import { createTestPinia } from './src/testing/test-utils'

describe('Palette store hasChanges logic', () => {
  let store

  beforeEach(() => {
    createTestPinia()
    store = usePaletteStore()
  })

  it('initial state hasChanges is false', () => {
    // This is NOT tested in the original test suite!
    // The original test only checks isOpen, name, type, etc. but not hasChanges initially.
    expect(store.hasChanges).toBe(false)
  })
})
