import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia } from '@/testing/test-utils'
import StartMenu from './StartMenu.vue'
import { usePaletteStore } from '@/stores/palette'

describe('StartMenu', () => {
  let pinia

  beforeEach(() => {
    pinia = createTestPinia()
  })

  function renderMenu() {
    return mount(StartMenu, {
      global: {
        plugins: [pinia],
        stubs: {
          TpsFileOpen: true,
        },
      },
    })
  }

  it('renders Manage Preferences.tps heading', () => {
    const wrapper = renderMenu()

    expect(wrapper.text()).toContain('Manage Preferences.tps')
  })

  it('renders Create a colour palette heading', () => {
    const wrapper = renderMenu()

    expect(wrapper.text()).toContain('Create a colour palette')
  })

  it('opens palette editor when Create button clicked', async () => {
    const wrapper = renderMenu()
    const store = usePaletteStore()

    const buttons = wrapper.findAll('button')
    const createButton = buttons.find(b => b.text() === 'Create a template')
    await createButton.trigger('click')

    expect(store.isOpen).toBe(true)
  })

  it('renders Open file button', () => {
    const wrapper = renderMenu()

    const buttons = wrapper.findAll('button')
    const openButton = buttons.find(b => b.text() === 'Open file...')

    expect(openButton.exists()).toBe(true)
  })
})
