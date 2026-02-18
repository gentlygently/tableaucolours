import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia, userEvent } from '@/testing/test-utils'
import TpsFileEditor from './TpsFileEditor.vue'
import { useTpsFileStore } from '@/stores/tpsfile'
import { usePaletteStore } from '@/stores/palette'

describe('TpsFileEditor', () => {
  let pinia, tpsStore, paletteStore

  beforeEach(() => {
    pinia = createTestPinia()
    tpsStore = useTpsFileStore()
    paletteStore = usePaletteStore()
    tpsStore.open('test.tps', '<xml/>', [
      { name: 'Red', type: 'regular', colours: ['#FF0000'] },
      { name: 'Blue', type: 'ordered-sequential', colours: ['#0000FF'] },
    ])
  })

  function renderEditor() {
    return mount(TpsFileEditor, {
      global: {
        plugins: [pinia],
        stubs: {
          TpsPaletteList: true,
          TpsPaletteFilter: true,
          TpsPaletteExport: true,
        },
      },
    })
  }

  it('renders file name', () => {
    const wrapper = renderEditor()

    expect(wrapper.find('.file').text()).toBe('test.tps')
  })

  it('renders palette list', () => {
    const wrapper = renderEditor()

    expect(wrapper.findComponent({ name: 'TpsPaletteList' }).exists()).toBe(true)
  })

  it('renders Add palette button', () => {
    const wrapper = renderEditor()

    expect(wrapper.find('.paletteactions-add button').exists()).toBe(true)
  })

  it('renders Delete selected button', () => {
    const wrapper = renderEditor()

    expect(wrapper.find('.paletteactions-delete button').exists()).toBe(true)
  })

  it('disables Delete selected when none selected', () => {
    const wrapper = renderEditor()

    expect(wrapper.find('.paletteactions-delete button').attributes('disabled')).toBeDefined()
  })

  it('renders Save button', () => {
    const wrapper = renderEditor()

    const saveBtn = wrapper.findAll('.fileactions button').find(b => b.text() === 'Save')
    expect(saveBtn.exists()).toBe(true)
  })

  it('disables Save when no changes', () => {
    tpsStore.hasChanges = false
    const wrapper = renderEditor()

    const saveBtn = wrapper.findAll('.fileactions button').find(b => b.text() === 'Save')
    expect(saveBtn.attributes('disabled')).toBeDefined()
  })

  it('renders Close button', () => {
    const wrapper = renderEditor()

    const closeBtn = wrapper.findAll('.fileactions button').find(b => b.text() === 'Close')
    expect(closeBtn.exists()).toBe(true)
  })

  it('renders Filter button', () => {
    const wrapper = renderEditor()

    expect(wrapper.find('.paletteactions-filter button').exists()).toBe(true)
  })

  it('renders Export button', () => {
    const wrapper = renderEditor()

    expect(wrapper.find('.paletteactions-export button').exists()).toBe(true)
  })

  it('opens palette editor when Add palette clicked', async () => {
    const wrapper = renderEditor()

    await userEvent.click(wrapper.find('.paletteactions-add button').element)

    expect(paletteStore.isOpen).toBe(true)
  })

  it('renders Select all button', () => {
    const wrapper = renderEditor()

    expect(wrapper.find('.paletteactions-selectall button').exists()).toBe(true)
  })

  it('renders Clear selection button', () => {
    const wrapper = renderEditor()

    expect(wrapper.find('.paletteactions-clear button').exists()).toBe(true)
  })
})
