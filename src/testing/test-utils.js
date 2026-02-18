import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import testingLibraryUserEvent from '@testing-library/user-event'

export const userEvent = testingLibraryUserEvent.setup({ delay: null })

/**
 * Creates a fresh Pinia instance and sets it as active.
 * Call in beforeEach() to isolate store state between tests.
 */
export function createTestPinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

/**
 * Mounts a Vue component with a fresh Pinia store.
 */
export function mountWithPinia(component, options = {}) {
  const pinia = createTestPinia()
  return mount(component, {
    global: {
      plugins: [pinia],
      stubs: {
        teleport: true,
      },
      ...options.global,
    },
    ...options,
  })
}

/**
 * Creates an array of colour objects matching the store's colour shape.
 */
let lastId = 1
export function createColours(colours = '', selected = false) {
  if (typeof colours === 'string') colours = [colours]
  if (typeof selected === 'boolean') selected = selected ? 0 : -1

  return colours.map((x, i) => ({
    id: lastId++,
    hex: (x || '#FFFFFF').toUpperCase(),
    isSelected: i === selected,
  }))
}

export function resetColourIds() {
  lastId = 1
}
