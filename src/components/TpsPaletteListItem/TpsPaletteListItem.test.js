import { describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { fireEvent } from '@testing-library/dom'
import { userEvent } from '@/testing/test-utils'
import TpsPaletteListItem from './TpsPaletteListItem.vue'

beforeAll(() => {
  Element.prototype.scrollIntoView = () => {}
})

function createPalette(overrides = {}) {
  return {
    id: 1,
    name: 'Test Palette',
    type: 'regular',
    colours: ['#FF0000', '#00FF00'],
    isCurrent: false,
    isSelected: false,
    hasChanges: false,
    moved: 0,
    ...overrides,
  }
}

describe('TpsPaletteListItem', () => {
  function renderItem(palette = createPalette(), canMove = true) {
    return mount(TpsPaletteListItem, {
      props: { palette, canMove },
      global: {
        stubs: {
          PalettePreview: true,
        },
      },
    })
  }

  it('renders palette name', () => {
    const wrapper = renderItem()

    expect(wrapper.find('.name').text()).toBe('Test Palette')
  })

  it('renders preview', () => {
    const wrapper = renderItem()

    expect(wrapper.findComponent({ name: 'PalettePreview' }).exists()).toBe(true)
  })

  it('applies current class when palette is current', () => {
    const wrapper = renderItem(createPalette({ isCurrent: true }))

    expect(wrapper.find('.palette--current').exists()).toBe(true)
  })

  it('does not apply current class when palette is not current', () => {
    const wrapper = renderItem()

    expect(wrapper.find('.palette--current').exists()).toBe(false)
  })

  it('applies changed class when palette has changes', () => {
    const wrapper = renderItem(createPalette({ hasChanges: true }))

    expect(wrapper.find('.palette--changed').exists()).toBe(true)
  })

  it('emits toggle-selected when checkbox changes', async () => {
    const palette = createPalette()
    const wrapper = renderItem(palette)

    fireEvent.change(wrapper.find('input[type="checkbox"]').element)

    expect(wrapper.emitted('toggle-selected')).toHaveLength(1)
    expect(wrapper.emitted('toggle-selected')[0][0]).toStrictEqual(palette)
  })

  it('emits clone when clone button clicked', async () => {
    const palette = createPalette()
    const wrapper = renderItem(palette)

    await userEvent.click(wrapper.find('.clone button').element)

    expect(wrapper.emitted('clone')).toHaveLength(1)
    expect(wrapper.emitted('clone')[0][0]).toStrictEqual(palette)
  })

  it('shows drag handle when canMove is true', () => {
    const wrapper = renderItem(createPalette(), true)

    expect(wrapper.find('.drag').exists()).toBe(true)
  })

  it('hides drag handle when canMove is false', () => {
    const wrapper = renderItem(createPalette(), false)

    expect(wrapper.find('.drag').exists()).toBe(false)
  })
})
