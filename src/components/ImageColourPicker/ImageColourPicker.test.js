import { describe, expect, it, beforeEach, vi } from 'vitest'
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

  it('ignores paste events on input elements', () => {
    const imageStore = useImageStore()
    renderPicker()

    const event = new Event('paste')
    Object.defineProperty(event, 'clipboardData', {
      value: {
        items: [{ kind: 'file', type: 'image/png', getAsFile: () => new File([''], 'img.png', { type: 'image/png' }) }],
      },
    })
    Object.defineProperty(event, 'target', { value: document.createElement('input') })
    window.dispatchEvent(event)

    expect(imageStore.hasImage).toBe(false)
  })

  it('ignores paste events without clipboard data', () => {
    const imageStore = useImageStore()
    renderPicker()

    const event = new Event('paste')
    Object.defineProperty(event, 'target', { value: document.body })
    window.dispatchEvent(event)

    expect(imageStore.hasImage).toBe(false)
  })

  it('ignores paste with non-image files', () => {
    renderPicker()

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const event = new Event('paste')
    Object.defineProperty(event, 'clipboardData', {
      value: {
        items: [{ kind: 'file', type: 'text/plain', getAsFile: () => new File([''], 'doc.txt', { type: 'text/plain' }) }],
      },
    })
    Object.defineProperty(event, 'target', { value: document.body })
    window.dispatchEvent(event)

    expect(consoleSpy).toHaveBeenCalledWith('File list did not contain image')
  })
})
