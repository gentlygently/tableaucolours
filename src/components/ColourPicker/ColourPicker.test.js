import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ColourPicker from './ColourPicker.vue'

describe('ColourPicker', () => {
  function renderPicker(hex = '#FF0000') {
    return mount(ColourPicker, {
      props: { hex },
      global: {
        stubs: {
          SketchColourPicker: true,
        },
      },
    })
  }

  it('renders the colour picker container', () => {
    const wrapper = renderPicker()

    expect(wrapper.find('.colourpicker').exists()).toBe(true)
  })

  it('renders the Done button', () => {
    const wrapper = renderPicker()

    expect(wrapper.find('.colourpicker-done').text()).toBe('Done')
  })

  it('emits done when Done button clicked', async () => {
    const wrapper = renderPicker()

    await wrapper.find('.colourpicker-done').trigger('click')

    expect(wrapper.emitted('done')).toHaveLength(1)
  })

  it('emits done on Enter key', async () => {
    const wrapper = renderPicker()

    await wrapper.find('.colourpicker').trigger('keyup.enter')

    expect(wrapper.emitted('done')).toHaveLength(1)
  })
})
