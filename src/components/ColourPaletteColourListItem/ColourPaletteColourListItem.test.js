import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia, userEvent } from '@/testing/test-utils'
import ColourPaletteColourListItem from './ColourPaletteColourListItem.vue'
import { usePaletteStore } from '@/stores/palette'

describe('ColourPaletteColourListItem', () => {
  let store, pinia

  beforeEach(() => {
    pinia = createTestPinia()
    store = usePaletteStore()
  })

  function renderItem(index = 0, colours = ['#FF0000', '#00FF00', '#0000FF']) {
    store.open({ name: '', type: 'regular', colours })
    return mount(ColourPaletteColourListItem, {
      props: {
        colour: store.colours[index],
        index,
        draggingActive: false,
      },
      global: {
        plugins: [pinia],
        stubs: {
          ColourPicker: true,
        },
      },
    })
  }

  it('renders the colour swatch with the correct background', () => {
    const wrapper = renderItem(0, ['#FF0000'])
    const swatch = wrapper.find('.colour-swatch')

    expect(swatch.attributes('style')).toContain('background-color: rgb(255, 0, 0)')
  })

  it('shows the hex value in the title', () => {
    const wrapper = renderItem(0, ['#ABCDEF'])

    expect(wrapper.find('.colour').attributes('title')).toContain('#ABCDEF')
  })

  it('selects the colour on click', async () => {
    const wrapper = renderItem(1, ['#111', '#222'])

    await userEvent.click(wrapper.find('.colour').element)

    expect(store.selectedColour).toBe(store.colours[1])
  })

  it('removes the colour when remove button is clicked', async () => {
    const wrapper = renderItem(1, ['#111', '#222', '#333'])

    await userEvent.click(wrapper.find('.colour-remove').element)

    expect(store.colours).toHaveLength(2)
  })

  it('adds selected class when colour is selected', () => {
    const wrapper = renderItem(0, ['#111', '#222'])
    store.selectColour(store.colours[0])

    expect(wrapper.find('.colour').classes()).toContain('colour--selected')
  })

  it('does not add selected class when colour is not selected', () => {
    const wrapper = renderItem(1, ['#111', '#222'])
    store.selectColour(store.colours[0])

    expect(wrapper.find('.colour').classes()).not.toContain('colour--selected')
  })

  it('sets grid position based on index', () => {
    const wrapper = renderItem(7, ['#111', '#222', '#333', '#444', '#555', '#666', '#777', '#888'])
    const style = wrapper.find('.colour').attributes('style')

    // index 7: column = floor(7/5)+1 = 2, row = (7%5)+1 = 3
    expect(style).toContain('grid-column: 2')
    expect(style).toContain('grid-row: 3')
  })
})
