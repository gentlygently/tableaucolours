import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia } from '@/testing/test-utils'
import TpsFileOpen from './TpsFileOpen.vue'

describe('TpsFileOpen', () => {
  let pinia

  beforeEach(() => {
    pinia = createTestPinia()
  })

  function renderComponent() {
    return mount(TpsFileOpen, {
      global: {
        plugins: [pinia],
        stubs: {
          ModalPanel: true,
          TpsFileErrors: true,
        },
      },
    })
  }

  it('renders a file input for .tps files', () => {
    const wrapper = renderComponent()

    const input = wrapper.find('input[type="file"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('accept')).toBe('.tps')
  })

  it('exposes selectFile method', () => {
    const wrapper = renderComponent()

    expect(typeof wrapper.vm.selectFile).toBe('function')
  })

  it('renders hidden by default', () => {
    const wrapper = renderComponent()

    expect(wrapper.find('.tpsfileopen').exists()).toBe(true)
  })
})
