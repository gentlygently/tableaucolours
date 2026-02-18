import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ScalableImage from './ScalableImage.vue'

describe('ScalableImage', () => {
  function renderImage(props = {}) {
    const img = new Image()
    Object.defineProperty(img, 'width', { value: 200 })
    Object.defineProperty(img, 'height', { value: 100 })

    return mount(ScalableImage, {
      props: {
        canPickColour: false,
        image: img,
        scale: 1,
        ...props,
      },
      global: {
        stubs: {
          ImageColourSwatch: true,
        },
      },
    })
  }

  it('renders a canvas element', () => {
    const wrapper = renderImage()

    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('renders the scalable image container', () => {
    const wrapper = renderImage()

    expect(wrapper.find('.scalableimage').exists()).toBe(true)
  })

  it('applies active class when canPickColour is true', () => {
    const wrapper = renderImage({ canPickColour: true })

    expect(wrapper.find('.scalableimage-image--active').exists()).toBe(true)
  })

  it('does not apply active class when canPickColour is false', () => {
    const wrapper = renderImage({ canPickColour: false })

    expect(wrapper.find('.scalableimage-image--active').exists()).toBe(false)
  })
})
