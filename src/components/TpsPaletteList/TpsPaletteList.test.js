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
  })

  function renderList(palettes = [
    { name: 'Red', type: 'regular', colours: ['#FF0000'] },
    { name: 'Blue', type: 'ordered-sequential', colours: ['#0000FF'] },
  ]) {
    store.open('test.tps', '<xml/>', palettes)
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
    const palettes = [
      { name: 'Red', type: 'regular', colours: ['#FF0000'] },
      { name: 'Blue', type: 'ordered-sequential', colours: ['#0000FF'] },
    ]
    const wrapper = renderList(palettes)

    expect(wrapper.find('.palettecount').text()).toContain('2 colour palettes')
  })

  it('shows singular when one palette', () => {
    const wrapper = renderList([
      { name: 'One', type: 'regular', colours: ['#000'] },
    ])

    expect(wrapper.find('.palettecount').text()).toContain('1 colour palette')
    expect(wrapper.find('.palettecount').text()).not.toContain('palettes')
  })

  it('shows selected count when palettes are selected', async () => {
    const palettes = [
      { name: 'Red', type: 'regular', colours: ['#FF0000'] },
      { name: 'Blue', type: 'ordered-sequential', colours: ['#0000FF'] },
    ]
    const wrapper = renderList(palettes)
    store.palettes[0].isSelected = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.palettecount').text()).toContain('1 selected')
  })
})
