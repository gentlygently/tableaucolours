import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ColourPaletteHelp from './ColourPaletteHelp.vue'

describe('ColourPaletteHelp', () => {
  it('renders without errors', () => {
    const wrapper = mount(ColourPaletteHelp)

    expect(wrapper.find('article').exists()).toBe(true)
  })

  it('contains expected heading', () => {
    const wrapper = mount(ColourPaletteHelp)

    expect(wrapper.find('h1').text()).toBe('Editing a colour palette')
  })
})
