import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia } from '@/testing/test-utils'
import AppHelp from './AppHelp.vue'
import { usePaletteStore } from '@/stores/palette'
import { useTpsFileStore } from '@/stores/tpsfile'

describe('AppHelp', () => {
  let pinia

  beforeEach(() => {
    pinia = createTestPinia()
  })

  function renderHelp() {
    return mount(AppHelp, {
      global: {
        plugins: [pinia],
        stubs: {
          ModalPanel: true,
          ColourPaletteHelp: true,
          TpsFileHelp: true,
        },
      },
    })
  }

  it('hides help button when neither editor is open', () => {
    const wrapper = renderHelp()

    expect(wrapper.find('.help-button').exists()).toBe(false)
  })

  it('shows help button when palette editor is open', () => {
    const store = usePaletteStore()
    store.open()
    const wrapper = renderHelp()

    expect(wrapper.find('.help-button').exists()).toBe(true)
  })

  it('shows help button when TPS file editor is open', () => {
    const store = useTpsFileStore()
    store.open('test.tps', '<xml/>', [
      { name: 'A', type: 'regular', colours: ['#000'] },
    ])
    const wrapper = renderHelp()

    expect(wrapper.find('.help-button').exists()).toBe(true)
  })

  it('has title tooltip', () => {
    const store = usePaletteStore()
    store.open()
    const wrapper = renderHelp()

    expect(wrapper.find('.help-button').attributes('title')).toBe('Help')
  })
})
