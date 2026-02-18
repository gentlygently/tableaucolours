import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia, userEvent } from '@/testing/test-utils'
import ColourPaletteEditor from './ColourPaletteEditor.vue'
import { usePaletteStore } from '@/stores/palette'

describe('ColourPaletteEditor', () => {
  let paletteStore, pinia

  beforeEach(() => {
    pinia = createTestPinia()
    paletteStore = usePaletteStore()
    paletteStore.open()
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  function renderEditor() {
    return mount(ColourPaletteEditor, {
      global: {
        plugins: [pinia],
        stubs: {
          teleport: true,
          ColourPaletteColourList: true,
          ColourPaletteGetCode: true,
          ColourPaletteExtractColours: true,
          ColourPaletteImport: true,
          ModalPanel: true,
          PalettePreview: true,
          ColourPaletteTypeSelector: true,
          ImageColourPicker: true,
        },
      },
    })
  }

  it('renders the palette name input', () => {
    const wrapper = renderEditor()

    expect(wrapper.find('#name').exists()).toBe(true)
  })

  it('binds palette name to input', () => {
    paletteStore.name = 'Test Palette'
    const wrapper = renderEditor()

    expect(wrapper.find('#name').element.value).toBe('Test Palette')
  })

  it('renders action buttons', () => {
    const wrapper = renderEditor()

    expect(wrapper.find('.extract button').exists()).toBe(true)
    expect(wrapper.find('.import button').exists()).toBe(true)
    expect(wrapper.find('.code button').exists()).toBe(true)
    expect(wrapper.find('.discard button').exists()).toBe(true)
    expect(wrapper.find('.reverse button').exists()).toBe(true)
    expect(wrapper.find('.add button').exists()).toBe(true)
  })

  it('adds a colour when add button is clicked', async () => {
    const wrapper = renderEditor()
    const initialCount = paletteStore.colours.length

    await userEvent.click(wrapper.find('.add button').element)

    expect(paletteStore.colours.length).toBe(initialCount + 1)
  })

  it('reverses colours when reverse button is clicked', async () => {
    paletteStore.replaceColours(['#111', '#222', '#333'])
    const wrapper = renderEditor()

    await userEvent.click(wrapper.find('.reverse button').element)

    expect(paletteStore.colours[0].hex).toBe('#333')
    expect(paletteStore.colours[2].hex).toBe('#111')
  })

  it('closes palette editor when back button is clicked', async () => {
    const wrapper = renderEditor()

    await userEvent.click(wrapper.find('.colourpalette-backbutton button').element)

    expect(paletteStore.isOpen).toBe(false)
  })

  it('prompts for confirmation when closing with changes', async () => {
    const wrapper = renderEditor()
    paletteStore.addColour()

    await userEvent.click(wrapper.find('.colourpalette-backbutton button').element)

    expect(confirm).toHaveBeenCalled()
  })
})
