import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { fireEvent } from '@testing-library/dom'
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

    expect(wrapper.find('.canvashint').isVisible()).toBe(true)
  })

  it('shows image hint when no image', () => {
    const wrapper = renderCanvas()

    const imageHint = wrapper.findAll('.canvashint-text')[0]
    expect(imageHint.isVisible()).toBe(true)
    expect(imageHint.text()).toContain('drop an image')
  })

  it('emits zoom on shift+wheel', async () => {
    const img = new Image()
    Object.defineProperty(img, 'width', { value: 100 })
    Object.defineProperty(img, 'height', { value: 100 })
    const wrapper = renderCanvas({ image: img, canPickColour: true })

    fireEvent.wheel(wrapper.find('.imagecanvas-canvas').element, { deltaY: -100, shiftKey: true })

    expect(wrapper.emitted('zoom')).toHaveLength(1)
  })

  it('emits file-dropped on drop', async () => {
    const wrapper = renderCanvas()
    const files = [new File([''], 'test.png', { type: 'image/png' })]

    fireEvent.drop(wrapper.find('.imagecanvas').element, {
      dataTransfer: { files },
    })

    expect(wrapper.emitted('file-dropped')).toHaveLength(1)
  })
})
