import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ColourPaletteTypeSelector from './ColourPaletteTypeSelector.vue'

describe('ColourPaletteTypeSelector', () => {
  function renderSelector(selectedTypeName = 'regular') {
    return mount(ColourPaletteTypeSelector, {
      props: { selectedTypeName },
      global: {
        stubs: {
          ColourPaletteTypeSelectorItem: {
            props: ['type'],
            template: '<div class="type-stub">{{ type.displayName }}</div>',
          },
        },
      },
    })
  }

  it('shows the selected type', () => {
    const wrapper = renderSelector('regular')

    expect(wrapper.find('.palettetypes-selectedtype').text()).toBe('Regular')
  })

  it('opens the dropdown list on click', async () => {
    const wrapper = renderSelector()

    await wrapper.find('.palettetypes-select').trigger('click')

    expect(wrapper.find('.palettetypes-list').classes()).toContain('palettetypes-list--open')
  })

  it('renders all three types in the list', () => {
    const wrapper = renderSelector()
    const items = wrapper.findAll('.palettetypes-type')

    expect(items).toHaveLength(3)
  })

  it('emits type-selected when a type is clicked', async () => {
    const wrapper = renderSelector('regular')

    await wrapper.find('.palettetypes-select').trigger('click')
    const items = wrapper.findAll('.palettetypes-type')
    await items[1].trigger('click')

    expect(wrapper.emitted('type-selected')).toHaveLength(1)
    expect(wrapper.emitted('type-selected')[0][0]).toBe('ordered-sequential')
  })

  it('navigates down with arrow key', async () => {
    const wrapper = renderSelector('regular')

    await wrapper.find('.palettetypes').trigger('keyup', { key: 'ArrowDown' })

    expect(wrapper.emitted('type-selected')[0][0]).toBe('ordered-sequential')
  })

  it('navigates up with arrow key', async () => {
    const wrapper = renderSelector('ordered-diverging')

    await wrapper.find('.palettetypes').trigger('keyup', { key: 'ArrowUp' })

    expect(wrapper.emitted('type-selected')[0][0]).toBe('ordered-sequential')
  })

  it('does not navigate below last type', async () => {
    const wrapper = renderSelector('ordered-diverging')

    await wrapper.find('.palettetypes').trigger('keyup', { key: 'ArrowDown' })

    expect(wrapper.emitted('type-selected')).toBeUndefined()
  })

  it('does not navigate above first type', async () => {
    const wrapper = renderSelector('regular')

    await wrapper.find('.palettetypes').trigger('keyup', { key: 'ArrowUp' })

    expect(wrapper.emitted('type-selected')).toBeUndefined()
  })

  it('marks the selected type in the list', () => {
    const wrapper = renderSelector('ordered-sequential')
    const items = wrapper.findAll('.palettetypes-type')

    expect(items[1].classes()).toContain('palettetypes-type--selected')
    expect(items[0].classes()).not.toContain('palettetypes-type--selected')
  })
})
