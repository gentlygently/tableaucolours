import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ColourPaletteTypeSelectorItem from './ColourPaletteTypeSelectorItem.vue'

function createType(classModifier, displayName) {
  return { name: classModifier, classModifier, displayName, isSelected: false }
}

describe('ColourPaletteTypeSelectorItem', () => {
  it('renders display name as label', () => {
    const wrapper = mount(ColourPaletteTypeSelectorItem, {
      props: { type: createType('regular', 'Regular') },
    })

    expect(wrapper.find('.palettetype-label').text()).toBe('Regular')
  })

  it('applies class modifier for regular type', () => {
    const wrapper = mount(ColourPaletteTypeSelectorItem, {
      props: { type: createType('regular', 'Regular') },
    })

    expect(wrapper.find('.palettetype--regular').exists()).toBe(true)
  })

  it('applies class modifier for sequential type', () => {
    const wrapper = mount(ColourPaletteTypeSelectorItem, {
      props: { type: createType('sequential', 'Sequential') },
    })

    expect(wrapper.find('.palettetype--sequential').exists()).toBe(true)
  })

  it('applies class modifier for diverging type', () => {
    const wrapper = mount(ColourPaletteTypeSelectorItem, {
      props: { type: createType('diverging', 'Diverging') },
    })

    expect(wrapper.find('.palettetype--diverging').exists()).toBe(true)
  })

  it('renders example div with type-specific class', () => {
    const wrapper = mount(ColourPaletteTypeSelectorItem, {
      props: { type: createType('sequential', 'Sequential') },
    })

    expect(wrapper.find('.palettetype-example--sequential').exists()).toBe(true)
  })
})
