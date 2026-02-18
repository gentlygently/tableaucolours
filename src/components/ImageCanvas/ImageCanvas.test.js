import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageCanvas from './ImageCanvas.vue'

describe('ImageCanvas', () => {
  function renderCanvas(props = {}) {
    const img = new Image()
    return mount(ImageCanvas, {
      props: {
        canPickColour: false,
        image: img,
        isPaletteOpen: false,
        isTpsFileOpen: false,
        scale: 1,
        ...props,
      },
      global: {
        stubs: {
          ScalableImage: true,
        },
      },
    })
  }

  it('shows hint message when no image is loaded', () => {
    const wrapper = renderCanvas()

    expect(wrapper.find('.canvashint').exists()).toBe(true)
  })

  it('shows image hint when no image', () => {
    const wrapper = renderCanvas()

    expect(wrapper.text()).toContain('Open')
    expect(wrapper.text()).toContain('drop an image')
  })

  it('emits zoom on shift+wheel', async () => {
    const img = new Image()
    Object.defineProperty(img, 'width', { value: 100 })
    Object.defineProperty(img, 'height', { value: 100 })
    const wrapper = renderCanvas({ image: img, canPickColour: true })

    const wheelEvent = new WheelEvent('wheel', { deltaY: -100, shiftKey: true, bubbles: true })
    wrapper.find('.imagecanvas-canvas').element.dispatchEvent(wheelEvent)

    expect(wrapper.emitted('zoom')).toHaveLength(1)
  })

  it('emits file-dropped on drop', async () => {
    const wrapper = renderCanvas()
    const files = [new File([''], 'test.png', { type: 'image/png' })]

    await wrapper.find('.imagecanvas').trigger('drop', {
      dataTransfer: { files },
    })

    expect(wrapper.emitted('file-dropped')).toHaveLength(1)
  })
})
