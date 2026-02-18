import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia, userEvent } from '@/testing/test-utils'
import ColourPaletteColourList from './ColourPaletteColourList.vue'
import { usePaletteStore } from '@/stores/palette'

describe('ColourPaletteColourList', () => {
  let store, pinia

  beforeEach(() => {
    pinia = createTestPinia()
    store = usePaletteStore()
    store.open({ name: '', type: 'regular', colours: ['#111', '#222', '#333', '#444', '#555'] })
  })

  function renderList() {
    return mount(ColourPaletteColourList, {
      global: {
        plugins: [pinia],
        stubs: {
          VueDraggable: {
            template: '<ul class="colourlist"><slot /></ul>',
            props: ['modelValue'],
          },
          ColourPaletteColourListItem: {
            template: '<li class="colour-stub" />',
            props: ['colour', 'index', 'draggingActive'],
          },
        },
      },
    })
  }

  it('renders a colour item for each colour in the store', () => {
    const wrapper = renderList()

    expect(wrapper.findAll('.colour-stub')).toHaveLength(5)
  })

  it('selects a colour by keyboard arrow down', async () => {
    const wrapper = renderList()
    store.selectColour(store.colours[0])

    await userEvent.keyboard('{ArrowDown}')
    await wrapper.vm.$nextTick()

    expect(store.selectedColour).toBe(store.colours[1])
  })

  it('selects a colour by keyboard arrow up', async () => {
    const wrapper = renderList()
    store.selectColour(store.colours[2])

    await userEvent.keyboard('{ArrowUp}')
    await wrapper.vm.$nextTick()

    expect(store.selectedColour).toBe(store.colours[1])
  })

  it('does not navigate past the last colour in a column', async () => {
    const wrapper = renderList()
    store.selectColour(store.colours[4])

    await userEvent.keyboard('{ArrowDown}')
    await wrapper.vm.$nextTick()

    expect(store.selectedColour).toBe(store.colours[4])
  })
})
