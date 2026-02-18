import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia, userEvent } from '@/testing/test-utils'
import ColourPaletteExtractColours from './ColourPaletteExtractColours.vue'
import { usePaletteStore } from '@/stores/palette'
import { useImageStore } from '@/stores/image'
import { mockGetPalette } from '../../../__mocks__/colorthief'

vi.mock('colorthief')

describe('ColourPaletteExtractColours', () => {
  let paletteStore, imageStore, pinia

  beforeEach(() => {
    pinia = createTestPinia()
    paletteStore = usePaletteStore()
    imageStore = useImageStore()
    paletteStore.open()

    const img = new Image()
    Object.defineProperty(img, 'width', { value: 100 })
    Object.defineProperty(img, 'height', { value: 100 })
    imageStore.setImage(img, 1)

    mockGetPalette.mockReturnValue([
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
    ])

    localStorage.clear()
  })

  function renderExtract() {
    return mount(ColourPaletteExtractColours, {
      global: { plugins: [pinia] },
    })
  }

  it('renders the number input with default value', () => {
    const wrapper = renderExtract()
    const input = wrapper.find('.extractcolours-numberinput')

    expect(input.element.value).toBe('8')
  })

  it('uses localStorage value for number of colours', () => {
    localStorage.numberOfColoursToExtract = '5'
    const wrapper = renderExtract()
    const input = wrapper.find('.extractcolours-numberinput')

    expect(input.element.value).toBe('5')
  })

  it('renders replace and add radio buttons', () => {
    const wrapper = renderExtract()

    expect(wrapper.find('#replaceColours').exists()).toBe(true)
    expect(wrapper.find('#addColours').exists()).toBe(true)
  })

  it('emits close when cancel is clicked', async () => {
    const wrapper = renderExtract()

    await userEvent.click(wrapper.find('.extractcolours-button--cancel').element)

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('extracts colours and replaces existing on extract', async () => {
    const wrapper = renderExtract()

    await userEvent.click(wrapper.find('.extractcolours-button--extract').element)

    expect(paletteStore.colours.length).toBeGreaterThan(0)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('saves number of colours to localStorage on extract', async () => {
    const wrapper = renderExtract()

    await userEvent.click(wrapper.find('.extractcolours-button--extract').element)

    expect(localStorage.numberOfColoursToExtract).toBeDefined()
  })
})
