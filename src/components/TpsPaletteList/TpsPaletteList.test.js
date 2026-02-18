import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia } from '@/testing/test-utils'
import TpsPaletteList from './TpsPaletteList.vue'
import { useTpsFileStore } from '@/stores/tpsfile'

describe('TpsPaletteList', () => {
  let pinia, store

  beforeEach(() => {
    pinia = createTestPinia()
    store = useTpsFileStore()
    store.open('test.tps', '<xml/>', [
      { name: 'Red', type: 'regular', colours: ['#FF0000'] },
      { name: 'Blue', type: 'ordered-sequential', colours: ['#0000FF'] },
    ])
  })

  function renderList() {
    return mount(TpsPaletteList, {
      global: {
        plugins: [pinia],
        stubs: {
          VueDraggable: {
            template: '<ul><slot /></ul>',
            props: ['modelValue'],
          },
          TpsPaletteListItem: true,
        },
      },
    })
  }

  it('renders palette count', () => {
    const wrapper = renderList()

    expect(wrapper.find('.palettecount').text()).toContain('2 colour palettes')
  })

  it('shows singular when one palette', () => {
    store.close()
    store.open('test.tps', '<xml/>', [
      { name: 'One', type: 'regular', colours: ['#000'] },
    ])
    const wrapper = renderList()

    expect(wrapper.find('.palettecount').text()).toContain('1 colour palette')
    expect(wrapper.find('.palettecount').text()).not.toContain('palettes')
  })

  it('shows selected count when palettes are selected', () => {
    store.palettes[0].isSelected = true
    const wrapper = renderList()

    expect(wrapper.find('.palettecount').text()).toContain('1 selected')
  })
})
