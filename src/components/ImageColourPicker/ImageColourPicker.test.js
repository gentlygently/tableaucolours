import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia } from '@/testing/test-utils'
import ImageColourPicker from './ImageColourPicker.vue'
import { usePaletteStore } from '@/stores/palette'
import { useImageStore } from '@/stores/image'

describe('ImageColourPicker', () => {
  let pinia

  beforeEach(() => {
    pinia = createTestPinia()
    const paletteStore = usePaletteStore()
    paletteStore.open()
  })

  function renderPicker() {
    return mount(ImageColourPicker, {
      global: {
        plugins: [pinia],
        stubs: {
          ImageCanvas: true,
          ImageFileOpen: true,
          ImageZoom: true,
        },
      },
    })
  }

  it('renders the toolbar', () => {
    const wrapper = renderPicker()

    expect(wrapper.find('.imagecolourpicker-toolbar').exists()).toBe(true)
  })

  it('renders the canvas container', () => {
    const wrapper = renderPicker()

    expect(wrapper.find('.imagecolourpicker-canvas').exists()).toBe(true)
  })

  it('renders zoom and file controls', () => {
    const wrapper = renderPicker()

    expect(wrapper.find('.zoomImage').exists()).toBe(true)
    expect(wrapper.find('.selectFile').exists()).toBe(true)
  })
})
