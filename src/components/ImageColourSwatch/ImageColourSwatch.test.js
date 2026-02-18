import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageColourSwatch from './ImageColourSwatch.vue'

describe('ImageColourSwatch', () => {
  it('renders a div with imagecolourswatch class', () => {
    const wrapper = mount(ImageColourSwatch, {
      props: { colour: '#FF0000', mousePosition: { x: 100, y: 200 } },
    })

    expect(wrapper.find('.imagecolourswatch').exists()).toBe(true)
  })

  it('sets background-color from colour prop', () => {
    const wrapper = mount(ImageColourSwatch, {
      props: { colour: '#FF0000', mousePosition: { x: 0, y: 0 } },
    })

    expect(wrapper.find('.imagecolourswatch').attributes('style')).toContain(
      'background-color: rgb(255, 0, 0)',
    )
  })

  it('positions swatch relative to mouse', () => {
    const wrapper = mount(ImageColourSwatch, {
      props: { colour: '#000', mousePosition: { x: 100, y: 200 } },
    })

    const style = wrapper.find('.imagecolourswatch').attributes('style')
    expect(style).toContain('left: 110px')
    expect(style).toContain('top: 160px')
  })
})
