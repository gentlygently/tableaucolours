import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia, userEvent } from '@/testing/test-utils'
import ColourPaletteGetCode from './ColourPaletteGetCode.vue'
import { usePaletteStore } from '@/stores/palette'

describe('ColourPaletteGetCode', () => {
  let store, pinia

  beforeEach(() => {
    pinia = createTestPinia()
    store = usePaletteStore()
    store.open({ name: 'Test', type: 'regular', colours: ['#ff0000'] })
    document.execCommand = vi.fn()
  })

  function renderGetCode() {
    return mount(ColourPaletteGetCode, {
      global: { plugins: [pinia] },
    })
  }

  it('displays the palette XML in a pre element', () => {
    const wrapper = renderGetCode()
    const code = wrapper.find('.getcode-code').text()

    expect(code).toContain('<color-palette')
    expect(code).toContain('name="Test"')
    expect(code).toContain('type="regular"')
    expect(code).toContain('#FF0000')
  })

  it('shows "Copy to clipboard" button initially', () => {
    const wrapper = renderGetCode()

    expect(wrapper.find('.getcode-copy').text()).toBe('Copy to clipboard')
  })

  it('calls document.execCommand("copy") when copy button is clicked', async () => {
    const wrapper = renderGetCode()

    await userEvent.click(wrapper.find('.getcode-copy').element)

    expect(document.execCommand).toHaveBeenCalledWith('copy')
  })

  it('changes button text to "Copied" after copying', async () => {
    const wrapper = renderGetCode()

    await userEvent.click(wrapper.find('.getcode-copy').element)

    expect(wrapper.find('.getcode-copy--copied').exists()).toBe(true)
    expect(wrapper.find('.getcode-copy').text()).toContain('Copied')
  })
})
